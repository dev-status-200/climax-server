module.exports = (sequelize, DataTypes) => {
    const Job_notes = sequelize.define("Job_notes", {
    
        type:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        title:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        note:{
            type:DataTypes.TEXT('long'),
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        createdBy:{
            type:DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        editBy :{
        type:DataTypes.STRING
        },
        opened :{
            type : DataTypes.STRING,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        } 
    })
    return Job_notes;
}
