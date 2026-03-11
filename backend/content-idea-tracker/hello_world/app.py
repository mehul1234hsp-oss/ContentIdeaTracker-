import json
import boto3
import os
import uuid
import logging
from datetime import datetime, timezone
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr

logger = logging.getLogger()
logger.setLevel(logging.INFO)

TABLE_NAME = os.environ["TABLE_NAME"]
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

IMAGE_BUCKET_NAME = os.environ.get("IMAGE_BUCKET_NAME")
s3_client = boto3.client('s3')

ALLOWED_CHANNELS = {"LinkedIn", "Twitter", "Instagram", "Facebook", "TikTok", "YouTube", "WhatsApp"}
ALLOWED_STATUS = {"idea", "draft", "published"}

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS"
}


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body)
    }


def parse_body(event):
    try:
        return json.loads(event.get("body", "{}"))
    except json.JSONDecodeError:
        return None


def current_timestamp():
    return datetime.now(timezone.utc).isoformat()


def get_user_id(event):
    try:
        return event["requestContext"]["authorizer"]["claims"]["sub"]
    except (KeyError, TypeError):
        return None


def lambda_handler(event, context):

    method = event.get("httpMethod")
    logger.info(f"Request received — method: {method}, path: {event.get('path')}")

    try:

        if method == "OPTIONS":
            logger.info("CORS preflight request handled")
            return response(200, {"message": "CORS preflight success"})

        user_id = get_user_id(event)
        if not user_id:
            logger.warning("Unauthorized request — no user_id found in token claims")
            return response(401, {"message": "Unauthorized"})

        logger.info(f"Authenticated request from user: {user_id}")

        if method == "POST":

            body = parse_body(event)
            if body is None:
                logger.warning(f"POST /ideas — invalid JSON body from user: {user_id}")
                return response(400, {"message": "Invalid JSON body"})

            text = body.get("text")
            name = body.get("name")
            channel = body.get("channel")
            status = body.get("status", "idea")
            links = body.get("links", [])
            images = body.get("images", [])

            if not text or not channel:
                logger.warning(f"POST /ideas — missing text or channel from user: {user_id}")
                return response(400, {"message": "text and channel are required"})

            if channel not in ALLOWED_CHANNELS:
                logger.warning(f"POST /ideas — invalid channel '{channel}' from user: {user_id}")
                return response(400, {"message": f"channel must be one of {list(ALLOWED_CHANNELS)}"})

            if status not in ALLOWED_STATUS:
                logger.warning(f"POST /ideas — invalid status '{status}' from user: {user_id}")
                return response(400, {"message": f"status must be one of {list(ALLOWED_STATUS)}"})

            idea_id = str(uuid.uuid4())

            item = {
                "id": idea_id,
                "userId": user_id,
                "name": name,
                "text": text,
                "channel": channel,
                "status": status,
                "links": links,
                "images": images,
                "createdAt": current_timestamp()
            }

            table.put_item(Item=item)
            logger.info(f"POST /ideas — idea created successfully: {idea_id} for user: {user_id}")

            return response(201, {
                "message": "Idea created successfully",
                "idea": item
            })

        elif method == "GET":
            # Check if this is a request for a secure S3 upload URL
            if event.get('path') == "/upload-url":
                filename = event.get('queryStringParameters', {}).get('filename')
                file_type = event.get('queryStringParameters', {}).get('fileType', 'image/jpeg')
                
                if not filename:
                    return response(400, {"message": "filename is required"})
                
                # Make the filename completely unique to avoid overwriting other users' images
                unique_filename = f"{user_id}/{str(uuid.uuid4())}_{filename}"
                
                try:
                    # Ask AWS S3 for a temporary secure upload link (valid for 5 minutes)
                    presigned_url = s3_client.generate_presigned_url(
                        'put_object',
                        Params={
                            'Bucket': IMAGE_BUCKET_NAME,
                            'Key': unique_filename,
                            'ContentType': file_type
                        },
                        ExpiresIn=300
                    )
                    
                    # The permanent public URL the image WILL have after upload
                    # This relies on standard S3 URL formatting
                    region = os.environ.get('AWS_REGION', 'ap-south-1')
                    public_url = f"https://{IMAGE_BUCKET_NAME}.s3.{region}.amazonaws.com/{unique_filename}"
                    
                    logger.info(f"Generated upload URL for user {user_id}: {unique_filename}")
                    return response(200, {
                        "uploadUrl": presigned_url,
                        "fileUrl": public_url
                    })
                except Exception as e:
                    logger.error(f"Error generating presigned URL: {str(e)}")
                    return response(500, {"message": "Could not generate upload URL"})

            # If it's NOT an upload-url request, return the list of ideas (Existing Code)
            result = table.scan(
                FilterExpression=Attr("userId").eq(user_id)
            )
            items = result.get("Items", [])
            logger.info(f"GET /ideas — returned {len(items)} ideas for user: {user_id}")

            return response(200, {
                "ideas": items
            })

        elif method == "PATCH":

            idea_id = event.get("pathParameters", {}).get("id")
            if not idea_id:
                logger.warning(f"PATCH /ideas — missing idea ID from user: {user_id}")
                return response(400, {"message": "Idea ID is required"})

            body = parse_body(event)
            if body is None:
                logger.warning(f"PATCH /ideas/{idea_id} — invalid JSON body from user: {user_id}")
                return response(400, {"message": "Invalid JSON body"})

            update_expr_parts = []
            expr_attr_names = {}
            expr_attr_values = {":uid": user_id}

            status = body.get("status")
            text = body.get("text")
            name = body.get("name")
            channel = body.get("channel")
            links = body.get("links")
            images = body.get("images")

            if status is None and text is None and name is None and channel is None and links is None and images is None:
                logger.warning(f"PATCH /ideas/{idea_id} — no fields to update provided by user: {user_id}")
                return response(400, {"message": "At least one field is required for update"})

            if status:
                if status not in ALLOWED_STATUS:
                    logger.warning(f"PATCH /ideas/{idea_id} — invalid status '{status}' from user: {user_id}")
                    return response(400, {"message": f"status must be one of {list(ALLOWED_STATUS)}"})
                update_expr_parts.append("#s = :s")
                expr_attr_names["#s"] = "status"
                expr_attr_values[":s"] = status

            if name:
                update_expr_parts.append("#n = :n")
                expr_attr_names["#n"] = "name"
                expr_attr_values[":n"] = name

            
            if text:
                update_expr_parts.append("#t = :t")
                expr_attr_names["#t"] = "text"
                expr_attr_values[":t"] = text

            if channel:
                if channel not in ALLOWED_CHANNELS:
                    logger.warning(f"PATCH /ideas/{idea_id} — invalid channel '{channel}' from user: {user_id}")
                    return response(400, {"message": f"channel must be one of {list(ALLOWED_CHANNELS)}"})
                update_expr_parts.append("#c = :c")
                expr_attr_names["#c"] = "channel"
                expr_attr_values[":c"] = channel
                
            if links is not None:
                update_expr_parts.append("#l = :l")
                expr_attr_names["#l"] = "links"
                expr_attr_values[":l"] = links

            if images is not None:
                update_expr_parts.append("#img = :img")
                expr_attr_names["#img"] = "images"
                expr_attr_values[":img"] = images

            update_expression = "SET " + ", ".join(update_expr_parts)

            try:
                update_result = table.update_item(
                    Key={"id": idea_id},
                    UpdateExpression=update_expression,
                    ExpressionAttributeNames=expr_attr_names,
                    ExpressionAttributeValues=expr_attr_values,
                    ConditionExpression="attribute_exists(id) AND userId = :uid",
                    ReturnValues="ALL_NEW"
                )

                logger.info(f"PATCH /ideas/{idea_id} — idea updated successfully for user: {user_id}")

                return response(200, {
                    "message": "Idea updated successfully",
                    "idea": update_result["Attributes"]
                })

            except ClientError as e:
                if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
                    logger.warning(f"PATCH /ideas/{idea_id} — idea not found or not owned by user: {user_id}")
                    return response(404, {"message": "Idea not found"})
                raise e

        elif method == "DELETE":

            idea_id = event.get("pathParameters", {}).get("id")
            if not idea_id:
                logger.warning(f"DELETE /ideas — missing idea ID from user: {user_id}")
                return response(400, {"message": "Idea ID is required"})

            try:
                table.delete_item(
                    Key={"id": idea_id},
                    ConditionExpression="attribute_exists(id) AND userId = :uid",
                    ExpressionAttributeValues={":uid": user_id}
                )

                logger.info(f"DELETE /ideas/{idea_id} — idea deleted successfully for user: {user_id}")

                return response(200, {
                    "message": "Idea deleted successfully",
                    "deleted_id": idea_id
                })

            except ClientError as e:
                if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
                    logger.warning(f"DELETE /ideas/{idea_id} — idea not found or not owned by user: {user_id}")
                    return response(404, {"message": "Idea not found"})
                raise e

        else:
            logger.warning(f"Unsupported method: {method}")
            return response(405, {"message": "Method not allowed"})

    except Exception as e:
        logger.error(f"Unhandled exception — method: {method}, error: {str(e)}", exc_info=True)
        return response(500, {"message": "Internal server error"})
