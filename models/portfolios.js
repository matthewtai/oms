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
      type: DataTypes.DECIMAL
    },
    cash:{
      type: DataTypes.DECIMAL
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
