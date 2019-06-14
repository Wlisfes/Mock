/*
 * @Date: 2019-05-29 15:34:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-14 23:32:39
 * @Description: 用户数据表
 */


const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
    uid: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        comment: `
            primaryKey: 主键
            allowNull: 不允许为null,
            type: int类型   标签id
        `
    },
    phone: {
        type: Sequelize.BIGINT(11),
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: int类型长度11  为登录账户&&手机号
        `
    },
    admin: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'same',
        comment: `
            allowNull: 不允许为null,
            type: STRING类型  管理员权限  same普通用户  admin超级用户
        `
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  账户密码
        `
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  用户头像
        `
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  用户昵称
        `
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null
            type: string类型  用户描述说明
        `
    },
    sex: {
        type: Sequelize.BIGINT(1),
        defaultValue: 1,
        comment: `
            defaultValue: 默认1
            type: BIGINT类型长度为1  1-女  2-男
        `
    },
    age: {
        type: Sequelize.BIGINT,
        defaultValue: 18,
        comment: `
            defaultValue: 默认18
            type: BIGINT类型 用户年龄
        `
    },
    status: {
        type: Sequelize.BIGINT(1),
        defaultValue: 2,
        comment: `
            defaultValue: 默认1
            type: int类型长度为1  1-关闭 2-开放
        `
    }
},{
    freezeTableName: true,
})


User.sync({
    // force: true
}).then(res => {
    console.log('users表同步成功')
})


module.exports = User;