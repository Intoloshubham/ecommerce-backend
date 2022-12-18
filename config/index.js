import dotenv from 'dotenv';
dotenv.config();

export const {
    PORT ,
    APP_URL,
    WS_PORT,
    DATABASE_URL,
    DEBUG_MODE,
    JWT_SECRET,
    REFRESH_SECRET,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_FROM
} = process.env