/*
 * @Date: 2019-05-29 15:34:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-09 10:33:14
 * @Description: 标签数据表
 */


const Sequelize = require('sequelize')
const db = require('../db')


const Tags = db.define("tags", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        comment: `
            primaryKey: 主键
            allowNull: 不允许为null,
            type: string类型   标签id
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
    },
    status: {
        type: Sequelize.BIGINT(1),
        defaultValue: 1,
        comment: `
            defaultValue: 默认1
            type: int类型长度为1    0-删除  1-关闭 2-开放
        `
    },
    description: {
        type: Sequelize.STRING,
        comment: `
            type: string类型  标签描述
        `
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null
            type: string类型  标签创建作者
        `
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: int类型  标签创建作者id
        `
    },
    weights: {
        type: Sequelize.BIGINT(2),
        defaultValue: 1,
        comment: `
            type: BIGINT类型  权重  默认为1
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


Tags.sync({
    // force: true
}).then(res => {
    console.log('tags表同步成功！')
})

module.exports = Tags;