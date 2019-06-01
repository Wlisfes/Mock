/*
 * @Date: 2019-05-29 15:34:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-01 22:01:48
 * @Description: 用户数据表
 */


const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('users', {
    uid: {
        type: Sequelize.BIGINT,
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
            type: int类型长度为1  1-女  2-男
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
})




// User.sync({
//     force: true
// })
User.sync()
    .then(res => {
    console.log('users表同步成功')
})

module.exports = User;