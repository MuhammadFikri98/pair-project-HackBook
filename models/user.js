"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, {
        foreignKey: "UserId",
      });

      User.hasMany(models.Post, {
        foreignKey: "UserId",
      });
    }

    getFormatedDate() {
      let d = this.createdAt.toLocaleDateString();
      d = d.split(",");
      const [dd, mm, yyyy] = d[0].split("/");
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email is required",
          },
          notEmpty: {
            msg: "Email is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          notEmpty: {
            msg: "Password is required",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Role is required",
          },
          notEmpty: {
            msg: "Role is required",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate(instance, option) {
          const salt = bcrypt.genSaltSync(8);
          const hash = bcrypt.hashSync(instance.password, salt);

          instance.password = hash
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
