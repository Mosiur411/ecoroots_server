import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  app: {
    application_name: process.env.APPLICATION_NAME,
    application_version: process.env.APPLICATION_VERSION,
  },

  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiration: process.env.JWT_EXPIRATION,
    refresh_secret: process.env.JWT_REFRESH,
    jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION,
  },

  password: {
    reset_password_secret: process.env.RESET_PASSWORD_SECRET,
    reset_password_expiration: process.env.RESET_PASSWORD_EXPIRATION,
    reset_password_link: process.env.RESET_PASSWORD_LINK,
    reset_password_api_key: process.env.RESEND_API_KEY,
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_APP_PASSWORD,
  },

  ssl: {
    store_id: process.env.STORE_ID,
    store_password: process.env.STORE_PASSWORD,
    validation_url: process.env.VALIDATION_URL,
    fail_url: process.env.FAIL_URL,
    cancel_url: process.env.CANCEL_URL,
  },

  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
