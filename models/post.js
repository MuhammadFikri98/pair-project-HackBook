"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: "UserId",
      });

      Post.hasMany(models.Post_Tag, {
        foreignKey: "PostId",
      });
    }

    static async findPost(search, Op) {
      try {
        let option = {
          include: [
            {
              model: sequelize.models.User,
              attributes: ["email"],
            },
            {
              model: sequelize.models.Post_Tag,
              include: sequelize.models.Tag,
            },
          ],
          order: [["createdAt", "DESC"]],
        };

        if (search) {
          option.where = {
            [Op.or]: [
              { title: { [Op.iLike]: `%${search}%` } },
              { content: { [Op.iLike]: `%${search}%` } },
            ],
          };
        }

        let post = await Post.findAll(option);

        return post;
      } catch (error) {
        throw error;
      }
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title is required",
          },
          notEmpty: {
            msg: "Title is required",
          },
        },
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Content is required",
          },
          notEmpty: {
            msg: "Content is required",
          },
          isMin3Words(value) {
            const wordCount = value
              .trim()
              .split(" ")
              .filter((word) => word).length;
            if (wordCount < 3) {
              throw new Error("Content must have at least 3 words");
            }
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "ImgUrl is required",
          },
          notEmpty: {
            msg: "ImgUrl is required",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User is required",
          },
          notEmpty: {
            msg: "User is required",
          },
        },
      },
      like: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Like is required",
          },
          notEmpty: {
            msg: "Like is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
