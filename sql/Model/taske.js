/*
 * @Author: 情雨随风
 * @Date: 2019-06-03 21:35:49
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-09 23:46:01
 * @Description: 项目数据表
 */


const Sequelize = require('sequelize')
const db = require('../db')

const Taske = db.define("taske",{
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        comment: `
            primaryKey: 主键
            allowNull: 不允许为null,
            type: string类型  项目id
        `
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: int类型  项目创建者id
        `
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null
            type: string类型  项目作者
        `
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  作者头像
        `
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  项目名称
        `
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  项目描述
        `
    },
    status: {
        type: Sequelize.BIGINT(1),
        defaultValue: 1,
        comment: `
            defaultValue: 默认1
            type: int类型长度为1  0-删除  1-关闭 2-开放
        `
    },
    weights: {
        type: Sequelize.BIGINT(2),
        defaultValue: 1,
        comment: `
            type: BIGINT类型  权重  默认为1
        `
    },
    suki: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        comment: `
            defaultValue: 默认0
            type: int类型  项目点赞数
        `
    },
    github: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  github地址
        `
    },
    viewUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  预览地址
        `
    }
},
{
    freezeTableName: true,
})


Taske.sync({
    // force: true
}).then(res => {
    console.log('taske表同步成功')
})

module.exports = Taske;