module.exports = function(Sequelize, DataTypes) {
    var Holdings = Sequelize.define("Holdings", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      portfolio: {
        type: DataTypes.STRING
      },
      ticker: {
        type: DataTypes.STRING
      },
      shares:{
        type: DataTypes.INTEGER
      },
      closeprice:{
        type: DataTypes.DECIMAL(10,2)
      }
    },
    {
      timestamps: false
    });
  
    // Task.associate = function(radixDB) {
    //   Task.belongsTo(radixDB.User, {
    //     foreignKey: {
    //       allowNull: false
    //     }
    //   });
    // };
  
    return Holdings;
  };
  