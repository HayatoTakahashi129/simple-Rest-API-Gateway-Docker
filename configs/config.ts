import ApiConfig, { isApiConfig } from "./types/ApiConfig";
import MethodConfig, { methods } from "./types/MethodConfig";

import jsYaml from "js-yaml";
import fs from "fs";

const CONFIG_PATH = process.env.CONFIG_PATH || "configs/apiConfig.yaml";

/**
 * parse config file and return as Object.
 * @returns parsed config file object.
 */
const readConfigFile = (): ApiConfig => {
  const file = fs.readFileSync(CONFIG_PATH, "utf-8");
  const apiConfigJson = jsYaml.load(file);
  if (!isApiConfig(apiConfigJson)) {
    console.log("first");
    throw new Error(
      `input yaml file is not the style we excepted.\n file path: ${CONFIG_PATH}\n YamlObject: ${JSON.stringify(
        apiConfigJson
      )}`
    );
  }
  return apiConfigJson;
};

const CACHED_CONFIG = readConfigFile();

export const getConfigs = () => {
  if (process.env.HOT_RELOAD === "true") return readConfigFile();
  return CACHED_CONFIG;
};

export const getConfig = (path: string, method: methods): MethodConfig => {
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

export const getProxyUrl = (path: string, method: methods): string => {
  const config = getConfig(path, method);
  if (!config.routeFqdn) {
    throw new Error(
      `Can not find routeFqdn in config yaml file.\n file path:${CONFIG_PATH} \n path: ${path} \n method: ${method}`
    );
  }
  return config.routeFqdn;
};
