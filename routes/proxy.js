const httpProxy = require("express-http-proxy");
const { getProxyUrl } = require("../configs/config");

const isHttps = (url) => {
  return url.includes("https://");
};

const getProxyPath = (proxyUrl) => {
  const sliceList = proxyUrl.split("/");
  if (sliceList.length <= 3) return "";

  return "/" + sliceList.slice(3).join("/");
};

const proxyRouter = (req, res, next) => {
  const url = req.path;
  const method = req.method.toLowerCase();
  const proxyUrl = getProxyUrl(url, method);
  console.log(proxyUrl);

  return httpProxy(proxyUrl, {
    https: isHttps(proxyUrl),
    proxyReqPathResolver: (req) => {
      const proxyPath = getProxyPath(proxyUrl);
      return proxyPath + req.url;
    },
  })(req, res, next);
};

module.exports = proxyRouter;
