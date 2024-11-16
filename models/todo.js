const { Sequelize } = require("sequelize");

const { Database } = require("../config/instance");
const User = require("./user");

const sequelize = Database.sequelize;

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("pending", "expired", "completed"),
      defaultValue: "pending",
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    paranoid: true,
    timestamps: true,
    underscored: true,
    tableName: "todos",
    freezeTableName: true,
    indexes: [
      {
        name: "todos_user_id",
        fields: ["userId"],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
);

Todo.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Todo, {
  foreignKey: "userId",
  as: "todo",
});

module.exports = Todo;
