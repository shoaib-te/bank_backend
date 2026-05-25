const AccountModel = require("../models/account.modul");

const createAccount = async (req, res) => {
  try {
    const user = req.user;

    const account = await AccountModel.create({
         userId: user._id
         });
    res.status(201).json({
         message: "account created",
         account: account 
         
        });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createAccount,
};
