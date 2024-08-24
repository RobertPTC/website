import postgres from "postgres";

import { Moment } from "../app/api/types";

export default async function getMoments(
  email: string,
  dbConnection: postgres.Sql<{}>,
  year?: string | null,
  month?: string | null,
  date?: string | null
) {
  const data = await dbConnection<
    Moment[]
  >`SELECT * FROM moment WHERE journalist_id IN (SELECT journalist_id FROM journalist WHERE email = ${email}) ${
    year ? dbConnection`AND year = ${year}` : dbConnection``
  } ${month ? dbConnection`AND month = ${month}` : dbConnection``} ${
    date ? dbConnection`AND date = ${date}` : dbConnection``
  } ORDER BY month ASC`;

  return data;
}
