import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const USER_POOL_ID = "ap-south-1_AqD7wpS2F";
const CLIENT_ID = "4f2105pj3js3bf4181l7cnumi5";

const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: CLIENT_ID,
});

export const signUp = (email, password) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const confirmSignUp = (email, code) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err),
    });
  });
};

export const logout = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) cognitoUser.signOut();
};

export const getToken = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) return resolve(null);

    cognitoUser.getSession((err, session) => {
      if (err) return resolve(null);
      if (!session.isValid()) return resolve(null);
      resolve(session.getIdToken().getJwtToken());
    });
  });
};

export const getCurrentUser = () => {
  return userPool.getCurrentUser();
};
