const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({},{
    timestamps: true,
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;