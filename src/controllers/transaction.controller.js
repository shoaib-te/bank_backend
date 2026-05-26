const Transaction = require("../models/transaction.modul");
const Ledger = require("../models/ledger.modul");
const Account = require("../models/account.modul");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");
const AccountModel = require("../models/account.modul");

const createTransaction = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount, idempotencyKey } = req.body;
    if (!fromAccountId || !toAccountId || !amount || !idempotencyKey) {
      return res.status(400).json({ message: "All fields are required" });
    } 
    const fromAccount = await Account.findById({
      _id: fromAccountId,
    });
    const toAccount = await Account.findById({
      _id: toAccountId,
    });
    if (!fromAccount || !toAccount) {
      return res.status(404).json({ message: "Account not found" });
    }
    const existingTransaction = await Transaction.findOne({
      idempotencyKey: idempotencyKey,
    });
    if (existingTransaction) {
      if (existingTransaction.status === "completed") {
        return res
          .status(200)
          .json({
            message: "Transaction already completed",
            transaction: existingTransaction,
          });
      }
      if (existingTransaction.status === "pending") {
        return res
          .status(200)
          .json({
            message: "Transaction is pending",
            transaction: existingTransaction,
          });
      }
      if (existingTransaction.status === "failed") {
        return res
          .status(200)
          .json({
            message: "Transaction failed",
            transaction: existingTransaction,
          });
      }
      if (existingTransaction.status === "reversed") {
        return res
          .status(200)
          .json({
            message: "Transaction reversed",
            transaction: existingTransaction,
          });
      }
    }
    if (fromAccount.status !== "active" || toAccount.status !== "active") {
      return res.status(400).json({ message: "Both accounts must be active" });
    }

    /**
     * decrease balance from fromAccount and increase balance to toAccount
     * create transaction with pending status
     * create ledger entry for both accounts with pending status
     * if any error occurs during the process, reverse the transaction and ledger entries
     * send email notification to both account holders about the transaction status
     */

    const balance = await fromAccount.getBalance();
    if (balance < amount) {
      return res
        .status(400)
        .json({
          message: `Insufficient balance in the from account${balance} is available${amount} is required`,
        });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
     const transaction = await Transaction.create({
        fromAccountId,
        toAccountId,
        amount,
        idempotencyKey,
        status: "pending",
     } , { session });
    const debitEntry = await Ledger.create({
        account: fromAccountId,
        type: "debit",
        amount,
        transaction: transaction._id,
        status: "pending",
     }, { session });
     const creditEntry = await Ledger.create({
        account:toAccountId,
        type: "credit",
        amount,
        transaction: transaction._id,
        status: "pending", 
     }, { session });


     transaction.status = "completed";
     await transaction.save({ session });

     await session.commitTransaction();
     session.endSession();

      await  emailService.transactionAlertEmail(
        req.user.email,
        req.user.name,
        amount,
        fromAccountId,
        toAccountId,
        "completed" 
           
        );
        return res.status(201).json({ message: "Transaction completed", transaction });
        
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const fundsTransaction = async (req, res) => {
  try {
    const { toAccountId, amount,idempotencyKey} = req.body;

    if (!toAccountId || !amount || !idempotencyKey) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const toAccount = await AccountModel.findById({
      _id: toAccountId,
    });
    if (!toAccount) {
      return res.status(404).json({ message: "Account not found" });
    }
    const FromUserAccount = await AccountModel.findById({
      user: req.user._id,
    });
    console.log(FromUserAccount);
    
if (!FromUserAccount) {
  return res.status(403).json({ message: "from user account is not found" });
}
const session = await mongoose.startSession();
session.startTransaction();

      const transaction = new Transaction([{  
        fromAccountId: FromUserAccount._id,
        toAccountId,
        amount,
        idempotencyKey,
        status: "pending",
      }], { session });
      const debitEntry = new Ledger([{
        account: FromUserAccount._id,
        type: "debit",
        amount,
        transaction: transaction._id,
        status: "pending",
      }], { session });
    

      transaction.status = "completed";
      await transaction.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({ message: "Funds added successfully", transaction });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};











module.exports = {
  createTransaction,
  fundsTransaction,
};

