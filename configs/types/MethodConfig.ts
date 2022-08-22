import Authorization, { isAuthorization } from "./Authorization";
type MethodConfig = {
  routeFqdn: string;
  authorization: Authorization;
};

export const isMethodConfig = (object: object): object is MethodConfig => {
  Object.entries(object).forEach(([key, value]) => {
    if (!isMethods(key)) return false;
    if (typeof value !== "object") return false;
    if (value == null) return false;
    if (!("routeFqdn" in value)) return false;
    if ("authorization" in value) {
      if (!isAuthorization(value.authorization)) return false;
    }
  });
  return true;
};

export type methods =
  | "GET"
  | "POST"
  | "OPTION"
  | "HEAD"
  | "PUT"
  | "PATCH"
  | "DELETE";

export const isMethods = (method: string): method is methods => {
  if (
    ["GET", "POST", "OPTION", "HEAD", "PUT", "PATCH", "DELETE"].includes(method)
  )
    return true;
  return false;
};

export default MethodConfig;
