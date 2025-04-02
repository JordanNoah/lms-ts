import { Sequelize } from "sequelize";
import { config } from "../config"

export const sequelize = new Sequelize({
    dialect: "mysql",
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    logging: false,
    define:{
        underscored: true,
        timestamps: true,
    },
})