import { Request, Response, NextFunction } from "express";
import Authorization from "../configs/types/Authorization";
import { getConfig } from "../configs/config";
import { isMethods } from "../configs/types/MethodConfig";

const getConfigAuthorization = (req: Request): Authorization | undefined => {
  const path = req.path;
  const method = req.method;
  if (!isMethods(method)) {
    throw new Error(`UnExpected method has come. \n method: ${method}`);
  }
  console.log("input:", { path, method });
  const config = getConfig(path, method);
  return config.authorization;
};

const getAuthorizationHeader = (
  req: Request,
  authorizationConfig: Authorization
): string => {
  let authorizationHeader: string | string[] =
    req.headers[authorizationConfig.header.toLowerCase()] ?? "";
  if (Array.isArray(authorizationHeader)) {
    authorizationHeader = authorizationHeader[0];
  }
  if (authorizationHeader.includes("Bearer"))
    authorizationHeader = authorizationHeader.replace("Bearer", "");
  authorizationHeader = authorizationHeader.replace(" ", "");
  return authorizationHeader;
};

const isDotsContains = (authorization: string): boolean => {
  if (!authorization) return false;
  const splitDots = authorization.split(".");
  return splitDots.length === 3;
};

const isExpired = (authorization: string): boolean => {
  if (!isDotsContains(authorization))
    throw new Error(
      `not JWT formatted token is scpecified.\n token: ${authorization}`
    );
  const payload = authorization.split(".")[1];
  const decodePayload = Buffer.from(payload, "base64").toString();
  const payloadJson = JSON.parse(decodePayload);
  if (!payloadJson.exp) throw new Error("no exp is exist in JWT.");

  const exp = payloadJson.exp;
  const now = new Date();
  const nowUnix = Math.floor(now.getTime() / 1000);

  return Number(exp) < nowUnix;
};

const unAuthorizedResponse = (res: Response, next: NextFunction) => {
  res.status(401);
  res.json({ message: "Unauthorized" });
  next();
};
/**
 * check only jwt contains 2 dots and exipres.
 * jwt libraries is little bit heavy.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const jwtAuthorizer = (req: Request, res: Response, next: NextFunction) => {
  const authorizationConfig = getConfigAuthorization(req);
  if (authorizationConfig == undefined) {
    next();
    return;
  }

  const authorizationHeader = getAuthorizationHeader(req, authorizationConfig);
  if (!authorizationHeader) {
    unAuthorizedResponse(res, next);
    return;
  }

  if (!isDotsContains(authorizationHeader)) {
    unAuthorizedResponse(res, next);
    return;
  }
  if (isExpired(authorizationHeader)) {
    unAuthorizedResponse(res, next);
    return;
  }
  next();
};

export default jwtAuthorizer;
