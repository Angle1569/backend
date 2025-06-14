import * as dotenv from "dotenv";
dotenv.config();

const { URI, PORT, SECRET_ACCESS_TOKEN } = process.env;

export default {
  URI,
  PORT,
  SECRET_ACCESS_TOKEN,
};
