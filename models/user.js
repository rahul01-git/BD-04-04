const { Sequelize } = require("sequelize");

const { Database } = require("../config/instance");

const sequelize = Database.sequelize;

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "users",
    freezeTableName: true,
    indexes: [
      {
        name: "users_email",
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

module.exports = User;
