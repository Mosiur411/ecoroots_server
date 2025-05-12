"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.smtp.host,
    port: Number(config_1.default.smtp.port),
    secure: false,
    auth: {
        user: config_1.default.smtp.user,
        pass: config_1.default.smtp.password,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const sendEmail = (email, html) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: `EcoRoots <${config_1.default.smtp.user}>`,
        to: email,
        subject: 'Reset Your Think Greenly Password!',
        html: html,
    });
});
exports.sendEmail = sendEmail;
