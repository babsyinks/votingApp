import type { Request } from "express";

/**
 * Ensure mocks are declared BEFORE any require/import that would load the module under test.
 * The mock factories below return mock functions/objects we can inspect via jest.requireMock(...)
 */
jest.mock("cloudinary", () => ({
  v2: {
    // make this a jest.fn so we can assert calls
    config: jest.fn(),
  },
}));

jest.mock("multer", () => {
  // multer() returns an "upload" middleware object; we return a sentinel to assert equality
  return jest.fn(() => ({ mocked: "multerInstance" }));
});

jest.mock("multer-storage-cloudinary", () => ({
  CloudinaryStorage: jest.fn(),
}));

/**
 * Helper to load the middleware after setting environment variables.
 * This uses require (not import) so the module loads under Jest's mocked module system.
 */
function loadUploadMedia() {
  // clear the require cache so module re-evaluates with current env/mocks
  jest.resetModules();
  // require the module freshly
  return require("../../middleware/uploadMedia");
}

describe("uploadMedia middleware", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    // Give each test a fresh slate
    jest.clearAllMocks();
    process.env = {
      ...OLD_ENV,
      CLOUDINARY_CLOUD_NAME: "test_cloud",
      CLOUDINARY_API_KEY: "test_key",
      CLOUDINARY_API_SECRET: "test_secret",
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("configures Cloudinary with environment variables", () => {
    const mod = loadUploadMedia();

    // Grab the mock implementation returned by jest.mock for 'cloudinary'
    const mockCloudinary = jest.requireMock("cloudinary").v2;
    expect(mockCloudinary.config).toHaveBeenCalledTimes(1);
    expect(mockCloudinary.config).toHaveBeenCalledWith({
      cloud_name: "test_cloud",
      api_key: "test_key",
      api_secret: "test_secret",
    });

    // also the module export exists
    expect(mod.cloudinary).toBeDefined();
  });

  it("creates CloudinaryStorage with correct parameters", async () => {
    const mod = loadUploadMedia();

    const CloudinaryStorageMock = jest.requireMock("multer-storage-cloudinary")
      .CloudinaryStorage as jest.Mock;

    expect(CloudinaryStorageMock).toHaveBeenCalledTimes(1);

    // the first arg object passed to new CloudinaryStorage({...})
    const storageOptions = CloudinaryStorageMock.mock.calls[0][0];
    expect(storageOptions).toHaveProperty("cloudinary");
    expect(typeof storageOptions.params).toBe("function");

    // storageOptions.cloudinary should be the module's exported cloudinary instance
    expect(storageOptions.cloudinary).toBe(mod.cloudinary);

    // test the async params function returns expected object
    const fakeReq = {} as Request;
    const fakeFile = { originalname: "example.jpg" } as Express.Multer.File;

    const params = await storageOptions.params(fakeReq, fakeFile);

    expect(params).toMatchObject({
      folder: "uploads",
      format: "png",
      transformation: [{ width: 300, height: 300, crop: "fill" }],
    });

    // public_id contains timestamp + filename (without extension)
    expect(typeof params.public_id).toBe("string");
    expect(params.public_id).toMatch(/_example$/);
  });

  it("creates multer instance with the CloudinaryStorage", () => {
    const mod = loadUploadMedia();

    const multerMock = jest.requireMock("multer") as jest.Mock;
    expect(multerMock).toHaveBeenCalledTimes(1);

    const multerArg = multerMock.mock.calls[0][0];
    expect(multerArg).toHaveProperty("storage");

    // upload should equal the sentinel returned by our multer mock
    expect(mod.upload).toEqual({ mocked: "multerInstance" });
  });

  it("exports configured Cloudinary instance", () => {
    const mod = loadUploadMedia();
    expect(mod.cloudinary).toBeDefined();
  });
});
