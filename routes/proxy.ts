import { Request, Response, NextFunction } from "express";

import httpProxy from "express-http-proxy";
import { getProxyUrl } from "../configs/config";
import { isMethods } from "../configs/types/MethodConfig";

const isHttps = (url: string): boolean => {
  return url.includes("https://");
};

const getProxyPath = (proxyUrl: string): string => {
  const sliceList: string[] = proxyUrl.split("/");
  if (sliceList.length <= 3) return "";

  return "/" + sliceList.slice(3).join("/");
};

const proxyRouter: (req: Request, res: Response, next: NextFunction) => void = (
  req,
  res,
  next
) => {
  const url: string = req.path;
  const method: string = req.method;
  if (!isMethods(method)) {
    throw new Error(`Unexpected method has come. \n method: ${method}`);
  }
  const proxyUrl: string = getProxyUrl(url, method);
  console.log(proxyUrl);
  if (!proxyUrl) {
    return res.status(404).json({ message: "Not Found" });
  }

  return httpProxy(proxyUrl, {
    https: isHttps(proxyUrl),
    proxyReqPathResolver: (req: Request): string => {
      const proxyPath: string = getProxyPath(proxyUrl);
      return proxyPath + req.url;
    },
  })(req, res, next);
};

export default proxyRouter;
