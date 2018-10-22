module.exports = function(Sequelize, DataTypes) {
  var User = Sequelize.define("User", {
    // Giving the Author model a name of type STRING
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [1],
          msg: "Invalid Username"
        }
      }
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [1],
          msg: "Invalid Password"
        }
      }
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [1],
          msg: "Invalid first name"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [1],
          msg: "Invalid last name"
        }
      }
    }
  });

  // User.associate = function(radixDB) {
  //   User.hasMany(radixDB.Task, {
  //     onDelete: "cascade"
  //   });
  // };

  return User;
};
