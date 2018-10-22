module.exports = function(Sequelize, DataTypes) {
  var Task = Sequelize.define("Task", {
    taskID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taskTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    taskDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    Year:{
      type: DataTypes.INTEGER,
      allowNull: false,
      len: [4]
    },
    Month:{
      type: DataTypes.INTEGER,
      allowNull: false,
      len: [1]
    },
    Day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      len: [1]
    },
    Hour:{
      type: DataTypes.INTEGER,
      allowNull: false,
      len: [1,2]
    },
    Minute:{
      type: DataTypes.INTEGER,
      allowNull: false,
      len: [4]
    }
  });

  Task.associate = function(radixDB) {
    Task.belongsTo(radixDB.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Task;
};
