import dotenv from 'dotenv';
dotenv.config();

export const {
    PORT ,
    APP_URL,
    WS_PORT,
    DATABASE_URL,
    DEBUG_MODE,
    
} = process.env