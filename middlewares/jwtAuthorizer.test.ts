import rewire from "rewire";
const __local__ = rewire("./jwtAuthorizer.ts");

describe("JWT Authorize middleware", () => {
  describe("get Auhorization configuration", () => {
    const getConfigAuthorization = __local__.__get__("getConfigAuthorization");
    test("when no authorization is specified, then return undefined", () => {
      expect(getConfigAuthorization({ path: "/todo", method: "GET" })).toBe(
        undefined
      );
    });
  });
});
