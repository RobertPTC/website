import postgres from "postgres";

const sql = postgres(process.env.DB_URI || "", {
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default sql;
