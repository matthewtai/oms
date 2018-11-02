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
        type: DataTypes.DECIMAL
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
  

    return Holdings;
  };
  