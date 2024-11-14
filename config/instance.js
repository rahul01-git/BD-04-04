require("dotenv/config");
const { Sequelize } = require("sequelize");

class Database {
  constructor() {
    this.dialect = process.env.DB_DIALECT;
    this.dbname = process.env.DB_NAME;
    this.username = process.env.DB_USER;
    this.password = process.env.DB_PASS;
    this.host = process.env.DB_HOST;
    this.port = process.env.DB_PORT;

    this.sequelize = new Sequelize(this.dbname, this.username, this.password, {
      host: this.host,
      dialect: this.dialect,
      port: this.port,
      logging: false,
    });
  }

  static get() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connection() {
    try {
      await this.sequelize.authenticate();
      console.info(`${this.dialect} database connected`);
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
}

const database = Database.get();

module.exports = { Database: database };
