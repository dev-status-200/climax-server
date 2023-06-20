module.exports = (sequelize, DataTypes) => {
    const Vessel = sequelize.define("Vessel", {
        code:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        carrier:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        name:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        type:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        pol:{
            type:DataTypes.STRING,
        },
        destinations:{
            type:DataTypes.STRING,
        },
    })
    return Vessel;
}