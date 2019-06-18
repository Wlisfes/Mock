/*
 * @Author: 情雨随风
 * @Date: 2019-06-01 15:56:14
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-19 00:24:13
 * @Description: 文章数据表
 */


const Sequelize = require('sequelize')
const db = require('../db')

const Article = db.define("article", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        comment: `
            primaryKey: 主键
            allowNull: 不允许为null,
            type: string类型  文章id
        `
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: int类型  文章作者id
        `
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  文章标题
        `
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null
            type: string类型  文章作者
        `
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: false
            type: string类型  文章描述
        `
    },
    theme: {
        type: Sequelize.STRING,
        defaultValue: 'OneDark',
        comment: `
            type: STRING类型  代码色调
        `
    },
    Text: {
        type: Sequelize.TEXT,
        comment: `
            type: TEXT类型  文章编辑文本
        `
    },
    Textvalue: {
        type: Sequelize.TEXT,
        comment: `
            type: TEXT类型  文章编辑文本
        `
    },
    picture: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: false
            type: string类型  文章缩略图
        `
    },
    read: {
        type: Sequelize.BIGINT,
        defaultValue: 1,
        comment: `
            defaultValue: 默认1
            type: int类型  文章阅读数
        `
    },
    suki: {
        type: Sequelize.BIGINT,
        defaultValue: 1,
        comment: `
            defaultValue: 默认1
            type: int类型  文章点赞数
        `
    },
    weights: {
        type: Sequelize.BIGINT(2),
        defaultValue: 1,
        comment: `
            type: BIGINT类型  权重  默认为1
        `
    },
    status: {
        type: Sequelize.BIGINT(1),
        defaultValue: 1,
        comment: `
            defaultValue: 默认1
            type: int类型长度为1  0-删除  1-关闭 2-开放
        `
    }

},
{
    freezeTableName: true,
})


Article.sync({
    // force: true
}).then(res => {
    console.log('article表同步成功')
})


module.exports = Article;

