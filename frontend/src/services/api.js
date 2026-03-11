import axios from "axios";
import { getToken } from "./cognito";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://qttckv2o2l.execute-api.ap-south-1.amazonaws.com/Prod";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

export const fetchIdeas = async () => {
  const response = await api.get("/ideas");
  return response.data.ideas;
};

export const createIdea = async (idea) => {
  const response = await api.post("/ideas", {
    name: idea.name || "",
    text: idea.text,
    channel: idea.channel,
    links: idea.links || [],
    images: idea.images || [],
    status: idea.status || "idea",  // uses the status chosen in the form
  });
  return response.data.idea;
};

// Re-added the missing updateStatus method (required for moving ideas between columns)
export const updateStatus = async (id, status) => {
  const response = await api.patch(`/ideas/${id}`, { status });
  return response.data.idea;
};

// The new updateIdea method with links, images and name support
export const updateIdea = async (id, { name, text, channel, links, images }) => {
  const response = await api.patch(`/ideas/${id}`, { name, text, channel, links, images });
  return response.data.idea;
};

export const deleteIdea = async (id) => {
  await api.delete(`/ideas/${id}`);
};

// Ask the backend for a temporary, secure S3 upload URL
export const getUploadUrl = async (filename, fileType) => {
  const response = await api.get("/upload-url", {
    params: { filename, fileType },
  });
  // This returns { uploadUrl: "...", fileUrl: "..." }
  return response.data;
};

// Use the temporary URL to put the actual file directly into the S3 bucket
export const uploadImageToS3 = async (uploadUrl, file) => {
  // Note: we use standard axios (not our custom 'api' instance)
  // because we are uploading directly to AWS S3, NOT our API Gateway.
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};
