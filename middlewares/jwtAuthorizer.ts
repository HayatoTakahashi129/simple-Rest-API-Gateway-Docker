import { Request, Response, NextFunction } from "express";
import Authorization from "../configs/types/Authorization";
const { getConfig } = require("../configs/config");

const getConfigAuthorization = (req: Request): Authorization => {
  const path = req.path;
  const method = req.method;
  console.log("input:", { path, method });
  const config = getConfig(path, method);
  return config.authorization;
};

const isValidConfig = (config: Authorization | undefined): boolean => {
  if (!config) return false;
  if (!config.hasOwnProperty("header") || !config.hasOwnProperty("type"))
    return false;
  return true;
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
  const splitDots = authorization.split(".");
  return splitDots.length === 3;
};

const isExpired = (authorization: string): boolean => {
  const payload = authorization.split(".")[1];
  const decodePayload = Buffer.from(payload, "base64").toString();
  const payloadJson = JSON.parse(decodePayload);

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
  if (!isValidConfig(authorizationConfig)) {
    next();
    return;
  }

  if (authorizationConfig.type !== "jwt") {
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

module.exports = jwtAuthorizer;
