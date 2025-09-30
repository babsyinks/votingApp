jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
  },
}));
jest.mock("multer", () => jest.fn(() => "mockMulterInstance"));
jest.mock("multer-storage-cloudinary", () => ({
  CloudinaryStorage: jest.fn(function (options) {
    return { options, mockStorage: true };
  }),
}));

describe("uploadMedia configuration", () => {
  let cloudinary;
  let multer;
  let CloudinaryStorage;

  beforeEach(() => {
    jest.resetModules();
    cloudinary = require("cloudinary").v2;
    multer = require("multer");
    CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;

    process.env.CLOUDINARY_CLOUD_NAME = "testCloud";
    process.env.CLOUDINARY_API_KEY = "testKey";
    process.env.CLOUDINARY_API_SECRET = "testSecret";
  });

  it("calls cloudinary.config with correct environment variables", () => {
    require("../../middleware/uploadMedia");
    expect(cloudinary.config).toHaveBeenCalledWith({
      cloud_name: "testCloud",
      api_key: "testKey",
      api_secret: "testSecret",
    });
  });

  it("creates CloudinaryStorage with correct params", () => {
    require("../../middleware/uploadMedia");

    expect(CloudinaryStorage).toHaveBeenCalledWith({
      cloudinary,
      params: expect.objectContaining({
        folder: "uploads",
        format: expect.any(Function),
        public_id: expect.any(Function),
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      }),
    });

    const { format } = CloudinaryStorage.mock.calls[0][0].params;
    return format({}, {}).then((result) => {
      expect(result).toBe("png");
    });
  });

  it("calls multer with the CloudinaryStorage instance", () => {
    require("../../middleware/uploadMedia");
    expect(multer).toHaveBeenCalledWith(
      expect.objectContaining({
        storage: expect.objectContaining({ mockStorage: true }),
      }),
    );
  });

  it("CloudinaryStorage params.format returns png", async () => {
  jest.resetModules();

  jest.mock("multer-storage-cloudinary", () => {
    return {
      CloudinaryStorage: jest.fn().mockImplementation((options) => {
        global.__formatFn = options.params.format;
        global.__publicIdFn = options.params.public_id;
        return { mockStorage: true };
      }),
    };
  });

  require("../../middleware/uploadMedia");

  const result = await global.__formatFn({}, { originalname: "test.jpg" });
  expect(result).toBe("png");
});

it("CloudinaryStorage params.public_id generates unique filename", () => {
  jest.resetModules();

  jest.mock("multer-storage-cloudinary", () => {
    return {
      CloudinaryStorage: jest.fn().mockImplementation((options) => {
        global.__publicIdFn = options.params.public_id;
        return { mockStorage: true };
      }),
    };
  });

  require("../../middleware/uploadMedia");

  const file = { originalname: "myphoto.jpg" };
  const id = global.__publicIdFn({}, file);
  expect(id).toMatch(/^\d+_myphoto$/);
});


  it("exports upload and cloudinary objects", () => {
    const { upload, cloudinary: exportedCloudinary } = require("../../middleware/uploadMedia");
    expect(upload).toBe("mockMulterInstance");
    expect(exportedCloudinary).toBe(cloudinary);
  });
});
