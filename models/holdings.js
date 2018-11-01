module.exports = function(Sequelize, DataTypes) {
    var Holdings = Sequelize.define("Holdings", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      ticker: {
        type: DataTypes.STRING
      },
      shares_owned:{
        type: DataTypes.INTEGER
      },
      current_weight:{
        type: DataTypes.DECIMAL
      },
      shares_buy_sell:{
        type: DataTypes.INTEGER
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
  
    return Portfolios;
  };
  