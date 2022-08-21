import Authorization from "./Authorization";
type MethodConfig = {
  routeFqdn: string;
  authorization: Authorization;
};

export type methods =
  | "GET"
  | "POST"
  | "OPTION"
  | "HEAD"
  | "PUT"
  | "PATCH"
  | "DELETE";

export default MethodConfig;
