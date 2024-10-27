const { DataTypes } = require("sequelize");

const { Database } = require("../config/instance");

const sequelize = Database.sequelize;

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      
    },
    status: {
      type: DataTypes.ENUM("pending", "expired", "completed"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "todos",
    freezeTableName: true,
  }
);


module.exports = Todo;
