type authType = "jwt";

type Authorization = {
  header: string;
  type: authType;
};

export const isAuthorization = (object: any): object is Authorization => {
  if (typeof object !== "object") return false;
  if (!("header" in object)) return false;
  if (!("type" in object)) return false;
  if (object.type) return false;
  return true;
};
export default Authorization;
