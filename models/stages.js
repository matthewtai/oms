module.exports = function(Sequelize, DataTypes) {
    var Stages = Sequelize.define("stages", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      portfolio_manager: {
        type: DataTypes.STRING
      },
      ticker: {
        type: DataTypes.STRING
      },
      portfolio:{
        type: DataTypes.STRING
      },
      old_weight:{
        type: DataTypes.DECIMAL
      },
      new_weight:{
        type: DataTypes.DECIMAL
      },
      shares_buy_sell: {
        type: DataTypes.DECIMAL
      },
      buy_or_sell:{
        type: DataTypes.DECIMAL
      },
      ticker_name:{
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false
    });
  
    return Stages;
  };
  