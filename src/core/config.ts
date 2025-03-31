import dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: {
    name: process.env.DB_NAME || 'lms',
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || '',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
  }
};
