/*
 * @Author: 情雨随风
 * @Date: 2019-06-12 22:16:16
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-13 00:28:57
 * @Description: 笔记标签子表
 */



const Sequelize = require('sequelize')
const db = require('../db')

const BookTags = db.define('book_tags', {
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
    tagsfirst_id: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  标签原始id
        `
    },
    tag_id: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  对应的数据id
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
},
{
    freezeTableName: true,
})


BookTags.sync({
    // force: true
}).then(res => {
    console.log('book_tags表同步成功')
})

module.exports = BookTags;