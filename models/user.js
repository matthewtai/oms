const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(Sequelize, DataTypes) {
  var User = Sequelize.define("User", {
    // Giving the Author model a name of type STRING
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(500),
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [1],
          msg: "Invalid Username"
        }
      }
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        len: {
          args: [1],
          msg: "Invalid Password"
        }
      }
    }
  },
    {
      classMethods: {
        validPassword: function(password, passwd, done, user){
          bcrypt.compare(password, passwd, function(err, isMatch){
            if(err) {
              console.log(err)
            }
            if(isMatch) {
              return done(null, user);
            }else{
              return done(null, false);
            }
          });
        }
      }
    },
    {
      dialect: 'mysql'
    },
    
);
      // User.hook('beforeCreate', (user, fn) =>{
      //   const salt = bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      //     return salt
      //   });
      //   bcrypt.hash(user.password, salt, null, (err, hash) =>{
      //     if(err) {
      //       return next(err);
      //     }
      //     user.password = hash;
      //     return fn(null, user)
      //   });
      // });

      User.beforeCreate((user, options) => {

        return bcrypt.hash(user.password, saltRounds)
            .then(hash => {
                user.password = hash;
            })
            .catch(err => { 
                throw new Error(); 
            });
      });

  return User;
};

  // User.associate = function(radixDB) {
  //   User.hasMany(radixDB.Task, {
  //     onDelete: "cascade"
  //   });
  // };

    
    // firstName: {
    //   type: DataTypes.STRING(50),
    //   allowNull: false,
    //   validate: {
    //     len: {
    //       args: [1],
    //       msg: "Invalid first name"
    //     }
    //   }
    // },
    // lastName: {
    //   type: DataTypes.STRING(100),
    //   allowNull: false,
    //   validate: {
    //     len: {
    //       args: [1],
    //       msg: "Invalid last name"
    //     }
    //   }
    // }