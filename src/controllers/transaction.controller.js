const Transaction = require('../models/transaction.model');
const Ledger = require('../models/ledger.modul');
const Account = require('../models/account.modul');


const createTransaction =async (req,res) => {
    try {
        const {fromAccountId,toAccountId,amount,idempotencyKey}= req.body;
        if(!fromAccountId || !toAccountId || !amount || !idempotencyKey){
            return res.status(400).json({message:'All fields are required'})
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}