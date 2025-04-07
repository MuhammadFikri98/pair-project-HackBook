"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post_Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post_Tag.belongsTo(models.Post, {
        foreignKey: "PostId",
      });

      Post_Tag.belongsTo(models.Tag, {
        foreignKey: "TagId",
      });
    }
  }
  Post_Tag.init(
    {
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Post is required",
          },
          notEmpty: {
            msg: "Post is required",
          },
        },
      },
      TagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tag is required",
          },
          notEmpty: {
            msg: "Tag is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Post_Tag",
    }
  );
  return Post_Tag;
};
