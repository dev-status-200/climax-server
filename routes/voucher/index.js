const {
  Vouchers,
  Voucher_Heads,
} = require("../../functions/Associations/voucherAssociations");
const {
  Child_Account,
} = require("../../functions/Associations/accountAssociations");
const routes = require("express").Router();
const Sequelize = require("sequelize");
const moment = require("moment");
const e = require("express");   
const Op = Sequelize.Op;
 
//Voucher Types

// (For Jobs)
// Job Reciept 
// Job Recievable
// Job Payment 
// Job Payble
 
// (For Expense)
// Expenses Payment

const setVoucherHeads = (id, heads) => {
  let result = [];
  heads.forEach((x) => {
    result.push({
      ...x,
      VoucherId: id,
      amount: `${x.amount}`
    });
  });
  return result;
};

routes.post("/voucherCreation", async (req, res) => {
  try {
    const check = await Vouchers.findOne({
      order: [["voucher_No", "DESC"]],
      attributes: ["voucher_No"],
      where: { vType: req.body.vType },
    });

    const result = await Vouchers.create({
      ...req.body,
      voucher_No: check == null ? 1 : parseInt(check.voucher_No) + 1,
      voucher_Id: `${
        req.body.CompanyId == 1
          ? "SNS"
          : req.body.CompanyId == 2
          ? "CLS"
          : "ACS"
      }-${req.body.vType}-${
        check == null ? 1 : parseInt(check.voucher_No) + 1
      }/${moment().format("YY")}`,
    }).catch((x)=>console.log(x))
    console.log(result)
    let dataz = await setVoucherHeads(result.id, req.body.Voucher_Heads);
    await Voucher_Heads.bulkCreate(dataz).catch((x) => console.log(x));
    await res.json({ status: "success", result:result });
  } catch (error) {
    res.json({ status: "error", result: error });
  }
});

routes.post("/voucherEdit", async (req, res) => {
  try {
    let result = await Vouchers.update({ ...req.body }, { where: { id: req.body.id } });
    console.log(result, req.body.id) 
    req.body.Voucher_Heads.forEach((x) => {
      return Voucher_Heads.upsert({ ...x, VoucherId: req.body.id, defaultAmount : "-" }) 
    }) 
    await res.json({ status: "success", result: "result" });
  } catch (error) {
    res.json({ status: "error", result: error });
  }
});  

routes.post("/deleteVoucher", async (req, res) => {
  try {
    const findOne = await Vouchers.findOne({
      where: {
        invoice_Voucher: "1",
        invoice_Id: req.body.id,
      },
    }).catch((x) => console.log(1, x));
    const resultOne = await Voucher_Heads.destroy({
      where: { VoucherId: findOne.dataValues.id },
    }).catch((x) => console.log(2, x));
    const resultTwo = await Vouchers.destroy({
      where: { id: findOne.dataValues.id },
    }).catch((x) => console.log(3, x));
    await res.json({ status: "success", result: { resultOne, resultTwo } });
  } catch (error) {
    res.json({ status: "error", result: error });
  }
});

routes.get("/getAccountActivity", async (req, res) => {
  try {
    const { debitaccount, creditaccount } = req.headers;
    let obj = {};

    if (debitaccount != "" && creditaccount == "") {
      obj = { ChildAccountId: debitaccount, type: "debit" };
    } else if (debitaccount == "" && creditaccount != "") {
      obj = { ChildAccountId: creditaccount, type: "credit" };
    } else if (debitaccount != "" && creditaccount != "") {
      obj = {
        [Op.or]: [
          { ChildAccountId: debitaccount, type: "debit" },
          { ChildAccountId: creditaccount, type: "credit" },
        ],
      };
    } else if (debitaccount == "" && creditaccount == "") {
      obj = {};
    }
    const resultOne = await Voucher_Heads.findAll({
      where: obj,
      include: [{ model: Vouchers }],
    });
    let items = [];
    resultOne.forEach((x) => items.push(x.Voucher.voucher_Id));
    let voucherIds = [...new Set(items)];

    const result = await Vouchers.findAll({
      attributes: ["voucher_Id", "currency", "exRate", "createdAt"],
      where: {
        voucher_Id: voucherIds,
        createdAt: {
          [Op.gte]: moment(req.headers.from).toDate(),
          [Op.lte]: moment(req.headers.to).add(1, "days").toDate(),
        },
      },
      include: [
        {
          model: Voucher_Heads,
          attributes: ["amount", "type"],
          include: [
            {
              model: Child_Account,
              attributes: ["id", "title"],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    await res.json({ status: "success", result: result });
  } catch (error) {
    res.json({ status: "error", result: error });
  }
});

routes.get("/getAllVouchers", async (req, res) => {
  try {
    const result = await Vouchers.findAll({
      order: [["createdAt", "DESC"]],
    });
    await res.json({ status: "success", result: result });
  } catch (error) {
    res.json({ status: "error", result: error });
  }
});

routes.get("/getVoucherById", async (req, res) => {
  try {
    console.log(req.headers);
    const result = await Vouchers.findOne({
      where: { id: req.headers.id },  
      include: [{ model: Voucher_Heads }],  
    });
    await res.json({ status: "success", result: result });
  } catch (error) {
    res.json({ status: "error", result: error });
  }
});   

module.exports = routes; 
