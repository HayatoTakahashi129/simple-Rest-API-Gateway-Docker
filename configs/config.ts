import ApiConfig from "./types/ApiConfig";
import MethodConfig, { methods } from "./types/MethodConfig";

const jsYaml = require("js-yaml");
const fs = require("fs");

const CONFIG_PATH = process.env.CONFIG_PATH || "configs/apiConfig.yaml";

/**
 * parse config file and return as Object.
 * @returns parsed config file object.
 */
const readConfigFile = (): ApiConfig => {
  try {
    const file = fs.readFileSync(CONFIG_PATH, "utf-8");
    return jsYaml.load(file);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const CACHED_CONFIG = readConfigFile();

const getConfigs = () => {
  if (process.env.HOT_RELOAD === "true") return readConfigFile();
  return CACHED_CONFIG;
};

const getConfig = (path: string, method: methods): MethodConfig => {
  const configs = getConfigs();
  if (!configs[path]) {
    throw new Error(
      `Can not find path in config yaml file.\n file path:${CONFIG_PATH} \n path: ${path} .`
    );
  }
  const methodConfig: MethodConfig | undefined = configs[path][method];
  if (!methodConfig) {
    throw new Error(
      `Can not find method in config yaml file.\n file path:${CONFIG_PATH} \n path: ${path} \n method: ${method}`
    );
  }
  return methodConfig;
};

const getProxyUrl = (path: string, method: methods): string => {
  const config = getConfig(path, method);
  if (!config.routeFqdn) {
    throw new Error(
      `Can not find routeFqdn in config yaml file.\n file path:${CONFIG_PATH} \n path: ${path} \n method: ${method}`
    );
  }
  return config.routeFqdn;
};

module.exports.getConfigs = getConfigs;
module.exports.getConfig = getConfig;
module.exports.getProxyUrl = getProxyUrl;
