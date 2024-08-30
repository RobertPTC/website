import { Moment } from "@app/app/api/types";

import client from "./client";

export default interface Database {
  getMoments(
    email: string,
    year?: string | null,
    month?: string | null,
    date?: string | null
  ): Promise<Moment[] | null>;
  setMoment(moment: Moment): Promise<string | null>;
  getMomentsNav(email: string): Promise<string[]>;
}

export const db: Database = {
  async getMoments(
    email: string,
    year?: string,
    month?: string,
    date?: string
  ): Promise<Moment[] | null> {
    try {
      const data = await client<
        Moment[]
      >`SELECT * FROM moment WHERE journalist_id IN (SELECT journalist_id FROM journalist WHERE email = ${email}) ${
        year ? client`AND year = ${year}` : client``
      } ${month ? client`AND month = ${month}` : client``} ${
        date ? client`AND date = ${date}` : client``
      } ORDER BY month ASC`;
      return data.map((d) => ({
        moment: d.moment,
        date_string: d.date_string,
        moment_id: d.moment_id,
        month: d.month,
        year: d.year,
        date: d.date,
        score: d.score,
      }));
    } catch (error) {
      console.log("error ", error);
      return null;
    }
  },
  async setMoment(moment) {
    const res = await client`
    INSERT INTO moment ${client(moment)} RETURNING moment_id;
`;
    return res[0].moment_id;
  },
  async getMomentsNav(email: string) {
    const data =
      await client`SELECT DISTINCT year FROM moment WHERE journalist_id IN (SELECT journalist_id FROM journalist WHERE email = ${email}) ORDER BY year DESC`;
    const result = data.map((v) => v.year);
    return result;
  },
};
