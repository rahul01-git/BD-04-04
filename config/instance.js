require("dotenv/config");
const { Sequelize } = require("sequelize");

class Database {
  constructor() {
    this.databaseUrl = process.env.DATABASE_URL;

    this.sequelize = new Sequelize(this.databaseUrl, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.info("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
      throw error;
    }
  }
}

const database = Database.getInstance();

module.exports = { Database: database };
