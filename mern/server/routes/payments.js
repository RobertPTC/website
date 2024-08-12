import express from "express";
import fileUpload from "express-fileupload";
import { XMLParser as FastXMLParser } from "fast-xml-parser";
import { v4 as uuidv4 } from "uuid";

/**
 * @typedef {Object} Employee
 * @property {string} DunkinId
 * @property {string} DunkinBranch
 */

/**
 * @typedef {Object} Payor
 * @property {string} DunkinId
 * @property {number} AccountNumber
 * @property {number} ABARouting
 * @property {number} EIN
 */

/**
 * @typedef {Object} Payee
 * @property {string} PlaidId
 * @property {number} LoanAccountNumber
 */

/**
 * @typedef {Object} Row
 * @property {Employee} Employee
 * @property {Payor} Payor
 * @property {Payee} Payee
 * @property {string} Amount
 */

/**
 * @function
 * @name parse
 * @param {string} xml
 * @returns {Object}
 */

/**
 * @typedef {Object} XMLParser
 * @property {parse} parse Transforms xml string into Javascript object
 */

/**
 *
 * @param {string} amount
 * @return number
 */
function dollarAmountToNumber(amount) {
  return Number(amount.slice(1)) * 100;
}
/**
 *
 * @param {XMLParser} xmlParser
 * @param {string} xml
 * @return {Row[]}
 */
function parseXMLFile(xmlParser, xml) {
  const parsed = xmlParser.parse(xml);
  const {
    root: { row },
  } = parsed;
  return row;
}
/**
 *
 * @param {{}} cache
 * @param {string} uuid
 * @param {Row[]} rows
 */
function putRowsInCache(cache, uuid, rows) {
  cache[uuid] = rows;
}

// replace with a non-memory cache for production
// should be an interface for dependency injection
let cache = {};

const router = express.Router();

router.use(fileUpload());

router.post("/upload-file", async (req, res) => {
  const parser = new FastXMLParser();
  const {
    files: { paymentFile },
  } = req;

  const rows = parseXMLFile(parser, paymentFile.data.toString());
  let employeeIDToEmployee = {};
  let payorIDToPayor = {};
  let fundsPerSourceAccount = {};
  let fundsPerBranch = {};
  let fundsPerEIN = {};
  let total = 0;
  rows.forEach((r) => {
    const {
      Employee,
      Payor,
      Payee: { LoanAccountNumber },
      Amount,
    } = r;
    const { DunkinBranch, DunkinId } = Employee;
    const { DunkinId: PayorDunkinId, AccountNumber, EIN } = Payor;
    const amount = dollarAmountToNumber(Amount);
    if (
      !DunkinId ||
      !DunkinBranch ||
      !PayorDunkinId ||
      !LoanAccountNumber ||
      isNaN(amount)
    ) {
      return;
    }
    total += amount;
    if (!fundsPerBranch[DunkinBranch]) {
      fundsPerBranch[DunkinBranch] = {
        amount,
      };
    } else {
      fundsPerBranch[DunkinBranch].amount += amount;
    }

    if (!fundsPerSourceAccount[AccountNumber]) {
      fundsPerSourceAccount[AccountNumber] = {
        amount,
      };
    } else {
      fundsPerSourceAccount[AccountNumber].amount += amount;
    }

    if (!fundsPerEIN[EIN]) {
      fundsPerEIN[EIN] = {
        amount,
      };
    } else {
      fundsPerEIN[EIN].amount += amount;
    }
    employeeIDToEmployee[DunkinId] = Employee;
    payorIDToPayor[PayorDunkinId] = Payor;
  });
  console.log("row[0] ", rows[0]);
  console.log("row[1] ", rows[1]);
  console.log("total ", total);
  console.log("fundsPerSourceAccount ", fundsPerSourceAccount);
  console.log("fundsPerBranch ", fundsPerBranch);
  console.log("fundsPerEIN ", fundsPerEIN);
  console.log("payorIDToPayor ", payorIDToPayor);
  const cacheID = uuidv4();
  putRowsInCache(cache, cacheID, rows);
  res
    .status(200)
    .json({ total, fundsPerSourceAccount, fundsPerBranch, cacheID });
});

export default router;
