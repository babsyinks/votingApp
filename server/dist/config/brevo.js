"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sib_api_v3_sdk_1 = __importDefault(require("sib-api-v3-sdk"));
const defaultClient = sib_api_v3_sdk_1.default.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new sib_api_v3_sdk_1.default.TransactionalEmailsApi();
exports.default = apiInstance;
