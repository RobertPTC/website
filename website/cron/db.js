import postgres from "postgres";

let db = null;

export function getDB() {
  if (!db) {
    db = postgres(process.env.DB_URI || "", {
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  return db;
}
/**
 * A moment in time that is precious to the journalist
 * @typedef {Object} Moment
 * @property {string} moment_id
 * @property {Date} created_at
 * @property {string} date_string
 * @property {string} moment
 * @property {string} journalist_id
 * @property {number} month
 * @property {number} date
 * @property {number} year
 * @property {string} score
 */

/**
 * @param {*} db
 * @param {string} email
 * @returns {Array.<Moment>}
 */
export async function getMoments(db, email) {
  const moments =
    await db`SELECT * FROM moment WHERE journalist_id IN (SELECT journalist_id FROM journalist WHERE email = ${email})`;
  db.end();
  return moments;
}
