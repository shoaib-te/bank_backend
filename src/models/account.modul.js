const mongooes = require('mongoose');
const ledgerModel = require('./ledger.modul')
const accountSchema = new mongooes.Schema({
  currency: {
    type: String,
    required: true,
    default:"USA"
  },
  status: {
    type:String,
    enum: {
      values: ['active', 'inactive','closed'],
      message: '{VALUE} is not supported',
      
    },
    default: 'active',
  },
  user: {
    type: mongooes.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
},{
    timestamps: true,
})
accountSchema.index({userId:1,status:1})

accountSchema.methods.getBalance = async function() {
  const balance = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebet: {
           $sum:{
            $cond: [
              { $eq: ['$type', 'debit']  
               }, '$amount', 0]
           }
          },
          totalCredit: {
            $sum: {
              $cond: [
                { $eq: ['$type', 'credit'] }, '$amount', 0]
            },
      
          
          },
      },

    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ['$totalCredit', '$totalDebet'] },
      },
    },

  ]);
  return balance.length > 0 ? balance[0].balance : 0;
  }



const AccountModel = mongooes.model('Account', accountSchema);

module.exports = AccountModel;