const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true,
    },
    toAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed',"reversed"],
            message: '{VALUE} is not supported',
        },
        default: 'pending',
    },
    idempotencyKey: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
},{
    timestamps: true,
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;