module.exports = function(Sequelize, DataTypes) {
  var Portfolios = Sequelize.define("Portfolios", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    portfolio: {
      type: DataTypes.STRING
    },
    mandate: {
      type: DataTypes.STRING
    },
    NAV:{
      type: DataTypes.INTEGER
    },
    cash:{
      type: DataTypes.DECIMAL
    },
    current_cash:{
      type: DataTypes.DECIMAL
    },
    old_weight: {
      type: DataTypes.DECIMAL
    },
    shares_owned:{
      type: DataTypes.INTEGER
    },
    shares_buy_sell:{
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: false
  });

  // Portfolios.associate = function(omsdb) {
  //   Portfolios.hasMany(omsdb.Holdings, {
  //     foreignKey: 'portfolio', sourceKey: 'portfolio'
  //   });
  // };

  return Portfolios;
};
