import rewire from "rewire";
import fs from "fs";

describe("get config", () => {
  const __local__ = rewire("./config.ts");
  const realFs = jest.requireActual("fs");
  afterEach(() => jest.restoreAllMocks());

  const setMockObject = (obj: string | Function) => {
    if (typeof obj === "string")
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(obj);
    else
      jest
        .spyOn(fs, "readFileSync")
        .mockImplementation(
          (
            path: fs.PathOrFileDescriptor,
            options?:
              | (fs.ObjectEncodingOptions & { flag?: string | undefined })
              | BufferEncoding
              | null
              | undefined
          ): string | Buffer => obj()
        );
  };
  describe("readConfigFile", () => {
    const readConfigFile: Function = __local__.__get__("readConfigFile");

    test("when specified correct config yaml file path, then return yaml information as JSON object.", () => {
      const returnObject = {
        "/todo": {
          GET: {
            routeFqdn:
              "https://stoplight.io/mocks/sonic-host/amplify-demo-todo/83730700",
          },
          POST: {
            routeFqdn:
              "https://stoplight.io/mocks/sonic-host/amplify-demo-todo/83730700",
            authorization: {
              header: "Authorization",
              type: "jwt",
            },
          },
        },
      };
      expect(readConfigFile()).toEqual(returnObject);
    });

    test("when not exist file path is specified, then throw error", () => {
      const notExistPath = "/notexistpath/sample.yaml";
      setMockObject(() => realFs.readFileSync(notExistPath, "utf-8"));
      expect(readConfigFile).toThrow();
    });

    test("when config file is not yaml format, then throw error.", () => {
      setMockObject("this is not yaml format");
      expect(readConfigFile).toThrow();
    });

    test("when config yaml file is not api-config format, then throw Error.", () => {
      setMockObject("test: \n  falsyMethod: 'false'");
      expect(readConfigFile).toThrow();
    });
  });
});
