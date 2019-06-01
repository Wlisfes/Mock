/*
 * @Author: 情雨随风
 * @Date: 2019-06-01 15:56:14
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-01 19:50:23
 * @Description: 文章数据表
 */


const Sequelize = require('sequelize')
const db = require('../db')
const ArticleTags = require('./articleTags')

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
        type: Sequelize.BIGINT,
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
            type: string类型  标签描述
        `
    },
    context: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: `
            allowNull: false
            type: string类型  文章内容
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
        defaultValue: 0,
        comment: `
            defaultValue: 默认1
            type: int类型  文章点赞数
        `
    },
    keep: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        comment: `
            defaultValue: 默认1
            type: int类型  文章收藏数
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

})

// Article.sync({
//     force: true
// })
Article.sync()
    .then(res => {
    console.log('article表同步成功')
})


module.exports = Article;

