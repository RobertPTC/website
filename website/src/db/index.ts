import { BlogComment, Moment } from "@app/app/api/types";

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
  getCommentsForBlog(blogID: string): Promise<BlogComment[] | null>;
  getCommentsCountForBlog(blogID: string): Promise<number | null>;
  setComment(comment: BlogComment): Promise<string | null>;
  getJournalistIDForEmail(email: string): Promise<string | null>;
}

// WITH RECURSIVE get_blog_comments AS (
//   SELECT text, responds_to, blog_comment_id, date, created_at
//   FROM blog_comment
//   WHERE responds_to = '95e09a1f-d248-4f99-8cf4-6ae2a4881367'

//   UNION ALL

//   SELECT bc.text, bc.responds_to, bc.blog_comment_id, bc.date, bc.created_at
//   FROM blog_comment bc
//   INNER JOIN get_blog_comments gbc ON bc.responds_to = gbc.blog_comment_id
// )
// SELECT text, responds_to, blog_comment_id, date FROM get_blog_comments;

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
  async getCommentsForBlog(blogID) {
    try {
      const data =
        await client`SELECT text, responds_to, blog_comment_id, date FROM blog_comment WHERE responds_to=${blogID} ORDER BY created_at ASC;`;
      return data.map((d) => ({
        responds_to: d.responds_to,
        text: d.text,
        blog_comment_id: d.blog_comment_id,
        date: d.date,
        journalist_id: "",
      }));
    } catch (error) {
      console.error("error ", error);
      return [];
    }
  },
  async setComment(comment: BlogComment): Promise<string | null> {
    try {
      const res = await client`INSERT INTO blog_comment ${client(
        comment
      )} RETURNING blog_comment_id`;
      return res[0].blog_comment_id;
    } catch (error) {
      console.error("error ", error);
      return null;
    }
  },
  async getJournalistIDForEmail(email) {
    try {
      const journalist =
        await client`SELECT journalist_id FROM journalist WHERE email = ${email}`;
      if (!journalist.length) {
        throw new Error("no journalist for selected email");
      }
      return journalist[0].journalist_id;
    } catch (error) {
      console.error("error", error);
      return null;
    }
  },
  async getCommentsCountForBlog(blogID) {
    try {
      const data = await client`WITH RECURSIVE get_blog_comments AS (
        SELECT text, responds_to, blog_comment_id, date, created_at
        FROM blog_comment
        WHERE responds_to = ${blogID}
      
        UNION ALL
      
        SELECT bc.text, bc.responds_to, bc.blog_comment_id, bc.date, bc.created_at
        FROM blog_comment bc
        INNER JOIN get_blog_comments gbc ON bc.responds_to = gbc.blog_comment_id
      )
      SELECT COUNT(blog_comment_id) FROM get_blog_comments;`;
      return data[0].count;
    } catch (error) {
      console.error("error ", error);
      return null;
    }
  },
};
