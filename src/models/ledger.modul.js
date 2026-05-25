const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true,
        immutable: true,
    },
    amount: {
        type: Number,
        required: true,
        immutable: true,
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
        index: true,
        immutable: true,
    },
    type: {
        type: String,
        enum: {
            values: ['credit', 'debit'],
            message: '{VALUE} is not supported',
        },
        required: true,
        immutable: true,
    },
},{
    timestamps: true,
});

function preventledgerUpdate() {
    throw new Error('Ledger entries cannot be updated once created');
}

ledgerSchema.pre('save', preventledgerUpdate);
ledgerSchema.pre('updateOne', preventledgerUpdate);
ledgerSchema.pre('findOneAndUpdate', preventledgerUpdate);
ledgerSchema.pre('updateMany', preventledgerUpdate);
ledgerSchema.pre('deleteOne', preventledgerUpdate);
ledgerSchema.pre('deleteMany', preventledgerUpdate);
ledgerSchema.pre('findOneAndDelete', preventledgerUpdate);
ledgerSchema.pre('findOneAndRemove', preventledgerUpdate);
ledgerSchema.pre('remove', preventledgerUpdate);
ledgerSchema.pre('delete', preventledgerUpdate);
ledgerSchema.pre('update', preventledgerUpdate);
ledgerSchema.pre('replaceOne', preventledgerUpdate);
const LedgerModel = mongoose.model('Ledger', ledgerSchema);

module.exports = LedgerModel;