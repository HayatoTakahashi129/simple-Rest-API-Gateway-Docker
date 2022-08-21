import MethodConfig, { methods } from "./MethodConfig";
type ApiConfig = {
  [url: string]: {
    [method in methods]?: MethodConfig;
  };
};

export default ApiConfig;
