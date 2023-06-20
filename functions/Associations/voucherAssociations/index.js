const { DataTypes } = require('sequelize')
const { Company, Invoice, Vouchers, Voucher_Heads } = require("../../../models");
const { Child_Account } = require("../accountAssociations");

//Vendors.belongsTo(Employees, { as: 'account_representator' });

Company.hasMany(Vouchers, {
    foriegnKey:{
        type: DataTypes.UUID,
        allowNull:false
    }
});
Vouchers.belongsTo(Company);

Vouchers.hasMany(Voucher_Heads, {
    foriegnKey:{
        type: DataTypes.UUID,
        allowNull:false
    }
});
Voucher_Heads.belongsTo(Vouchers);

Child_Account.hasMany(Voucher_Heads, {
    foriegnKey:{
        type: DataTypes.UUID,
        allowNull:false
    }
});
Voucher_Heads.belongsTo(Child_Account);

module.exports = { Vouchers, Voucher_Heads }