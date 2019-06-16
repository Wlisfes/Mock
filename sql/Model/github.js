/*
 * @Author: 情雨随风
 * @Date: 2019-06-16 21:20:03
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-16 22:07:26
 * @Description: 友链数据表
 */


const Sequelize = require('sequelize')
const db = require('../db')

const GitHub = db.define("github", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        comment: `
            primaryKey: 主键
            allowNull: 不允许为null,
            type: string类型  GitHub作者id
        `
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  管理员id
        `
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  管理员头像
        `
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  管理员昵称
        `
    },
    githubName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  GitHub名称
        `
    },
    github: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  GitHub地址
        `
    },
    githubAvatar: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  GitHub作者头像
        `
    },
    blog: {
        type: Sequelize.STRING,
        comment: `
            type: string类型  GitHub作者博客
        `
    },
    sex: {
        type: Sequelize.BIGINT(1),
        defaultValue: 1,
        comment: `
            defaultValue: 默认1
            type: BIGINT类型长度为1 GitHub作者性别  1-女  2-男
        `
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  GitHub作者名称
        `
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型  GitHub作者居住城市
        `
    },
    weights: {
        type: Sequelize.BIGINT(2),
        defaultValue: 1,
        comment: `
            type: BIGINT类型  权重  默认为1
        `
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null
            type: string类型  GitHub作者介绍
        `
    },
    status: {
        type: Sequelize.BIGINT(1),
        defaultValue: 2,
        comment: `
            defaultValue: 默认1
            type: int类型长度为1  1-关闭 2-开放
        `
    },
    createdAt: {
		type: Sequelize.DATE,
		field: 'created_at',
		allowNull: false,
		defaultValue: Sequelize.NOW
	},
	updatedAt: {
		type: Sequelize.DATE,
		field: 'updated_at',
		allowNull: false,
		detaultValue: Sequelize.NOW
	}
},
{
    freezeTableName: true,
})


GitHub.sync({
    // force: true
}).then(res => {
    console.log('github表同步成功')
})


module.exports = GitHub;