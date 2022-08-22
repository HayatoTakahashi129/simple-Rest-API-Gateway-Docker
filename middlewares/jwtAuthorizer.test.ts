import rewire from "rewire";
import Authorization from "../configs/types/Authorization";

const createSampleJWT = (paylaod: object | string): string => {
  let paylaodString = "";
  if (typeof paylaod === "object") paylaodString = JSON.stringify(paylaod);
  else paylaodString = paylaod;
  const header =
    "eyJraWQiOiJBNWxBY1l1Vk1UaWdybDIwZjV3cWs4MEJVNnNGeXlENlc2WXpBZktjT0dFPSIsImFsZyI6IlJTMjU2In0";
  const signature =
    "LQK8rxGxMwuoydkontIT-MxX_uy0fTq1aIW46q6QMSeePEQUJJ_lO2mNgv5qdBgYI22uSmbbf2dSGzP_GdOd778USVjesldQbGIlPngZksHOAVsyDBFqwNPBw4hK1LFtDHb1Nal7BxY3C1rwSh76IjLIsVOt0jQDmgovTDG8hqz2h8Xv5d0KpV1ssCXrl22w4-UPQ3bNLcvPkEuYNmzStXkl23bhnMcjP_X66D5zoKt6bpKHU-cgJjIcEeTeUXxufxeClFyZQc4kjeMff8BfTbJhhMmwBEp7y4UDniaErEvsrZIIKj_iLcMlSxZSYwlJpkKYhSAW3OBo9l8va0qxTw";
  const encodePayload = Buffer.from(paylaodString).toString("base64");
  return header + "." + encodePayload + "." + signature;
};

describe("JWT Authorize middleware", () => {
  afterEach(() => jest.clearAllMocks()); // clear all mock count.
  const __local__ = rewire("./jwtAuthorizer.ts");
  describe("getConfigAuthorization", () => {
    const getConfigAuthorization = __local__.__get__("getConfigAuthorization");
    const testFunc = (path: string, method: string) => () =>
      getConfigAuthorization({ path, method });

    test("when specified api doesn't have authorization in config, then return undefined", () => {
      expect(testFunc("/todo", "GET")()).toBe(undefined);
    });

    test("when not exist api in config is specified, then throw error.", () => {
      expect(testFunc("/noexistpath", "GET")).toThrow();
    });

    test("when not exist method is specified (like method:FOO), then throw error.", () => {
      expect(testFunc("/todo", "FOO")).toThrow();
    });

    test("when specified method doesn't exist in config, then throw error. ", () => {
      expect(testFunc("/todo", "HEAD")).toThrow();
    });

    test("when specified exist url and method, then return authorization config.", () => {
      const expectConfig: Authorization = {
        header: "Authorization",
        type: "jwt",
      };
      expect(testFunc("/todo", "POST")()).toEqual(expectConfig);
    });
  });

  describe("getAuthorizationHeader", () => {
    const getAuthorizationHeader = __local__.__get__("getAuthorizationHeader");
    const authConfig = { header: "Authorization" };
    const testFunction = (authHeaders: undefined | string | string[]) =>
      getAuthorizationHeader(
        { headers: { authorization: authHeaders } },
        authConfig
      );

    const expectResult = (
      inputHeader: undefined | string | string[],
      expectValue: string
    ) => expect(testFunction(inputHeader)).toBe(expectValue);

    test("when no authorization header is in request, then return empty string.", () => {
      expectResult(undefined, "");
    });

    test("when authorization header with no bearer is in request, then return that value.", () => {
      expectResult("authresult", "authresult");
    });

    test("when authorization header with bearer is in request, then return the value without bearer", () => {
      expectResult("Bearer authresult", "authresult");
    });

    test("when multiple authorization headeers without bearer are in the request, then return first value", () => {
      expectResult(["firstResult", "secondResult"], "firstResult");
    });

    test("when multiple authorization headeers with bearer are in the request, then return first value without bearer", () => {
      expectResult(
        ["Bearer firstResult", "Bearer secondResult"],
        "firstResult"
      );
    });
  });

  describe("isDotsContains", () => {
    const isDotsContains = __local__.__get__("isDotsContains");
    const expectNotValidString = (value: string | null) =>
      expect(isDotsContains(value)).toBe(false);

    test("when specified valid jwt, then return true", () => {
      const jwt: string =
        "eyJraWQiOiJBNWxBY1l1Vk1UaWdybDIwZjV3cWs4MEJVNnNGeXlENlc2WXpBZktjT0dFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmYWQ4NDFmZS1mNzg3LTQwYWItOWVlMC0xOWJhNGFkM2U1YjciLCJjb2duaXRvOmdyb3VwcyI6WyJEZW1vVXNlciJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLW5vcnRoZWFzdC0xX0VJQ1ZuV2pJeSIsImNvZ25pdG86dXNlcm5hbWUiOiJmYWQ4NDFmZS1mNzg3LTQwYWItOWVlMC0xOWJhNGFkM2U1YjciLCJjdXN0b206bmlja25hbWUiOiJoYXlhdG8iLCJvcmlnaW5fanRpIjoiYzBkNTk4ZTktNGU0MC00MDBjLTk4MTQtN2M0OTk4NjIwN2Y2IiwiYXVkIjoiN3Q5aWF1YzB2azNvZDZ2YTV0ZWxhbDVoZSIsImV2ZW50X2lkIjoiN2MzNDJlN2ItYzgzZi00Yzg2LTk0NTctNjZjOGYzZTIxMGVlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjAzODE5MjcsImV4cCI6MTY2MTA1Mjc1MywiaWF0IjoxNjYxMDQ5MTUzLCJqdGkiOiI3Yjc5NjUxNy1mOGIwLTQ1ZTctOTRjYi1kNWJlOTc0ZjNhMGUiLCJlbWFpbCI6ImhheWF0by4wMTI5OTVAZ21haWwuY29tIn0.LQK8rxGxMwuoydkontIT-MxX_uy0fTq1aIW46q6QMSeePEQUJJ_lO2mNgv5qdBgYI22uSmbbf2dSGzP_GdOd778USVjesldQbGIlPngZksHOAVsyDBFqwNPBw4hK1LFtDHb1Nal7BxY3C1rwSh76IjLIsVOt0jQDmgovTDG8hqz2h8Xv5d0KpV1ssCXrl22w4-UPQ3bNLcvPkEuYNmzStXkl23bhnMcjP_X66D5zoKt6bpKHU-cgJjIcEeTeUXxufxeClFyZQc4kjeMff8BfTbJhhMmwBEp7y4UDniaErEvsrZIIKj_iLcMlSxZSYwlJpkKYhSAW3OBo9l8va0qxTw";
      expect(isDotsContains(jwt)).toBe(true);
    });

    test("when specified null, then return false", () => {
      expectNotValidString(null);
    });

    test("when no dots string was specified, then return false", () => {
      expectNotValidString("nodotsexistyeeeeahhhh");
    });

    test("when only 1 dot is in argument string, then return false", () => {
      expectNotValidString("onlyonedot.isinstring");
    });

    test("when more than 2 dots included string is specified, then return false", () => {
      expectNotValidString("morethan.twodots.isincluded.inthisstring");
    });
  });

  describe("isExpired", () => {
    const isExpired = __local__.__get__("isExpired");
    const testFunc = (authorization: string | null) => () =>
      isExpired(authorization);
    const expectWithError = (value: string | null) =>
      expect(testFunc(value)).toThrow();

    test("when null is specified, then throw error.", () => {
      expectWithError(null);
    });

    test("when no dots string was specified, then throw error.", () => {
      expectWithError("testwithnodots");
    });

    test("when not json object was specified as paylaod, then throw error.", () => {
      const jwt = createSampleJWT("samplejwtpayload");
      expectWithError(jwt);
    });

    test("when no exp in payload, then throw error.", () => {
      const paylaod = {
        sub: "fad841fe-f787-40ab-9ee0-19ba4ad3e5b7",
        iss: "https://sample.com",
        origin_jti: "c0d598e9-4e40-400c-9814-7c49986207f6",
        aud: "7t9iauc0vk3od6va5telal5he",
        token_use: "id",
        auth_time: 1660381927,
        iat: 1661049153,
        jti: "7b796517-f8b0-45e7-94cb-d5be974f3a0e",
      };
      const jwt = createSampleJWT(paylaod);
      expectWithError(jwt);
    });

    test("when exp is specified as expired date, then return true", () => {
      const paylaod = {
        sub: "fad841fe-f787-40ab-9ee0-19ba4ad3e5b7",
        iss: "https://sample.com",
        origin_jti: "c0d598e9-4e40-400c-9814-7c49986207f6",
        exp: 1661052753, // Sat Aug 13 2022 18:12:07 GMT+0900
        aud: "7t9iauc0vk3od6va5telal5he",
        token_use: "id",
        auth_time: 1660381927,
        iat: 1661049153,
        jti: "7b796517-f8b0-45e7-94cb-d5be974f3a0e",
      };
      const jwt = createSampleJWT(paylaod);
      expect(isExpired(jwt)).toBe(true);
    });

    test("when exp is specified not expired date, then return true", () => {
      const paylaod = {
        sub: "fad841fe-f787-40ab-9ee0-19ba4ad3e5b7",
        iss: "https://sample.com",
        origin_jti: "c0d598e9-4e40-400c-9814-7c49986207f6",
        exp: 9999052753, // Sat Aug 13 2022 18:12:07 GMT+0900
        aud: "7t9iauc0vk3od6va5telal5he",
        token_use: "id",
        auth_time: 1660381927,
        iat: 1661049153,
        jti: "7b796517-f8b0-45e7-94cb-d5be974f3a0e",
      };
      const jwt = createSampleJWT(paylaod);
      expect(isExpired(jwt)).toBe(false);
    });
  });

  describe("jwtAuthorizer", () => {
    const jwtAuthorizer = __local__.__get__("jwtAuthorizer");
    const statusFn = jest.fn();
    const jsonFn = jest.fn();
    const response = { status: statusFn, json: jsonFn };
    const nextFn = jest.fn();

    type Request = {
      path: string;
      method: string;
      headers?: {
        authorization: undefined | string | string[];
      };
    };

    const expectSuccessAuthorized = (req: Request) => {
      jwtAuthorizer(req, response, nextFn);
      expect(nextFn.mock.calls.length).toBe(1);

      expect(response.json.mock.calls.length).toBe(0);
      expect(response.status.mock.calls.length).toBe(0);
    };
    const expectUnauthorized = (req: Request) => {
      jwtAuthorizer(req, response, nextFn);
      expect(response.status.mock.calls.length).toBe(1);
      expect(response.status.mock.calls[0][0]).toBe(401);

      expect(response.json.mock.calls.length).toBe(1);
      expect(response.json.mock.calls[0][0]).toEqual({
        message: "Unauthorized",
      });

      expect(nextFn.mock.calls.length).toBe(1);
    };

    test("when no authorization config api and method is specified, then success jwt authorize.", () => {
      const request: Request = { path: "/todo", method: "GET" };
      expectSuccessAuthorized(request);
    });

    test("when no authorization header is exist and specified auth api, then response Unauthorized.", () => {
      const request: Request = {
        path: "/todo",
        method: "POST",
        headers: { authorization: undefined },
      };
      expectUnauthorized(request);
    });

    test("when authorization header don't contains 2 dots and specified auth api, then response Unauthorized.", () => {
      const request: Request = {
        path: "/todo",
        method: "POST",
        headers: { authorization: "authwithnodots" },
      };
      expectUnauthorized(request);
    });

    test("when authorization header contains expired token and specified auth api, then response Unauthorized.", () => {
      const request: Request = {
        path: "/todo",
        method: "POST",
        headers: {
          authorization:
            "header.eyJzdWIiOiJmYWQ4NDFmZS1mNzg3LTQwYWItOWVlMC0xOWJhNGFkM2U1YjciLCJjb2duaXRvOmdyb3VwcyI6WyJEZW1vVXNlciJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLW5vcnRoZWFzdC0xX0VJQ1ZuV2pJeSIsImNvZ25pdG86dXNlcm5hbWUiOiJmYWQ4NDFmZS1mNzg3LTQwYWItOWVlMC0xOWJhNGFkM2U1YjciLCJjdXN0b206bmlja25hbWUiOiJoYXlhdG8iLCJvcmlnaW5fanRpIjoiYzBkNTk4ZTktNGU0MC00MDBjLTk4MTQtN2M0OTk4NjIwN2Y2IiwiYXVkIjoiN3Q5aWF1YzB2azNvZDZ2YTV0ZWxhbDVoZSIsImV2ZW50X2lkIjoiN2MzNDJlN2ItYzgzZi00Yzg2LTk0NTctNjZjOGYzZTIxMGVlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjAzODE5MjcsImV4cCI6MTY2MTA1Mjc1MywiaWF0IjoxNjYxMDQ5MTUzLCJqdGkiOiI3Yjc5NjUxNy1mOGIwLTQ1ZTctOTRjYi1kNWJlOTc0ZjNhMGUiLCJlbWFpbCI6ImhheWF0by4wMTI5OTVAZ21haWwuY29tIn0.signature",
        },
      };
      expectUnauthorized(request);
    });

    test("when valid authorizatin header contains and specified auth api, then success.", () => {
      const paylaod = {
        sub: "fad841fe-f787-40ab-9ee0-19ba4ad3e5b7",
        iss: "https://sample.com",
        origin_jti: "c0d598e9-4e40-400c-9814-7c49986207f6",
        exp: 9999052753, // Sat Aug 13 2022 18:12:07 GMT+0900
        aud: "7t9iauc0vk3od6va5telal5he",
        token_use: "id",
        auth_time: 1660381927,
        iat: 1661049153,
        jti: "7b796517-f8b0-45e7-94cb-d5be974f3a0e",
      };
      const jwt = createSampleJWT(paylaod);
      const request: Request = {
        path: "/todo",
        method: "POST",
        headers: { authorization: jwt },
      };
      expectSuccessAuthorized(request);
    });
  });
});
