/*
 * @Date: 2019-05-29 15:02:54
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-29 17:16:32
 * @Description: db文件
 */


const Sequelize = require("sequelize")
import { SQLCOFN } from '../config'

//连接mysql
const db = new Sequelize(
    SQLCOFN.DATABASE,
    SQLCOFN.DATABASE_NAME,
    SQLCOFN.DATABASE_PASSWORD,
    {
        host: SQLCOFN.HOST,
        dialect: SQLCOFN.DIALECT,
        pool: SQLCOFN.POOL,
        logging: SQLCOFN.LOGGING
    }
);

db.authenticate()
    .then(() => {
        console.log('连接成功！')
    })
    .catch(()=> {
        console.log('连接失败！')
    })

module.exports = db;


