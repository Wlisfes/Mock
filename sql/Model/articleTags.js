/*
 * @Author: 情雨随风
 * @Date: 2019-06-01 18:15:18
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-02 15:44:28
 * @Description: 文章标签子表
 */


const Sequelize = require('sequelize')
const db = require('../db')

const ArticleTags = db.define('article_tags', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: `
            primaryKey: 主键
            allowNull: 不允许为null
            autoIncrement: 自增
        `
    },
    article_id: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  文章id
        `
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型   标签名称
        `
    },
    color: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  十六进制颜色
        `
    }
})


// ArticleTags.sync({
//     force: true
// })

ArticleTags.sync()
    .then(res => {
    console.log('article_tags表同步成功')
})

module.exports = ArticleTags;