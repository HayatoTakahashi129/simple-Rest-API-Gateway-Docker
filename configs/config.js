const jsYaml = require("js-yaml");
const fs = require("fs");

const FILE_PATH = "configs/apiConfig.yaml";

/**
 * parse config file and return as Object.
 * @returns parsed config file object.
 */
const readConfigFile = () => {
  try {
    const file = fs.readFileSync(FILE_PATH, "utf-8");
    return jsYaml.load(file);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const CACHED_CONFIG = readConfigFile();

const getConfigs = () => {
  if (process.env.HOST_RELOAD === "true") return readConfigFile();
  return CACHED_CONFIG;
};

const getConfig = (path, method) => {
  const configs = getConfigs();
  const methodLower = method.toLowerCase();
  return configs[path]?.[methodLower];
};

const getProxyUrl = (path, method) => {
  const config = getConfig(path, method);
  return config?.routeFqdn;
};

module.exports.getConfigs = getConfigs;
module.exports.getConfig = getConfig;
module.exports.getProxyUrl = getProxyUrl;
