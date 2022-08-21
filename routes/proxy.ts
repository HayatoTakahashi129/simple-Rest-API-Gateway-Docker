import { Request, Response, NextFunction } from "express";
const httpProxy = require("express-http-proxy");
const { getProxyUrl } = require("../configs/config");

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
  const method: string = req.method.toLowerCase();
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
