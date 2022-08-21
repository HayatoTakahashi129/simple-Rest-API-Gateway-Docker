import Authorization from "./Authorization";
type MethodConfig = {
  routeFqdn: string;
  authorization: Authorization;
};

export type methods =
  | "get"
  | "post"
  | "option"
  | "head"
  | "put"
  | "patch"
  | "delete";

export default MethodConfig;
