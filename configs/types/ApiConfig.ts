import MethodConfig, { isMethodConfig, methods } from "./MethodConfig";
type ApiConfig = {
  [url: string]: {
    [method in methods]?: MethodConfig;
  };
};

export const isApiConfig = (object: unknown): object is ApiConfig => {
  if (typeof object !== "object") return false;
  if (object == null) return false;

  for (const value of Object.values(object)) {
    if (!isMethodConfig(value)) {
      return false;
    }
  }
  return true;
};

export default ApiConfig;
