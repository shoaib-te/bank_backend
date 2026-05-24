const mongooes = require('mongoose');

const accountSchema = new mongooes.Schema({
  currency: {
    type: String,
    required: true,
    default:"USA"
  },
  status: {
    enum: {
      values: ['active', 'inactive','closed'],
      message: '{VALUE} is not supported',
      default: 'active',
    },
  },
  userId: {
    type: mongooes.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
},{
    timestamps: true,
})
accountSchema.index({user:1,status:1})

const AccountModel = mongooes.model('Account', accountSchema);

module.exports = AccountModel;