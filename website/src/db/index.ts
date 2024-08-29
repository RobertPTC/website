import { Moment } from "@app/app/api/types";
import postgres from "postgres";

interface Database {
  getMoments(
    email: string,
    year: string,
    month: string,
    date: string
  ): Promise<Moment[]>;
}

const sql = postgres(process.env.DB_URI || "", {
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default sql;
