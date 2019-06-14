/*
 * @Author: 情雨随风
 * @Date: 2019-06-12 22:10:02
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-14 09:59:12
 * @Description: 笔记数据表
 */


const Sequelize = require('sequelize')
const db = require('../db')


const Book = db.define("book",{
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        comment: `
            primaryKey: 主键
            allowNull: 不允许为null,
            type: string类型  笔记id
        `
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: string类型   笔记名称
        `
    },
    status: {
        type: Sequelize.BIGINT(1),
        defaultValue: 1,
        comment: `
            defaultValue: 默认1
            type: int类型长度为1   0-删除  1-关闭 2-开放
        `
    },
    description: {
        type: Sequelize.STRING,
        comment: `
            type: string类型  笔记描述
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
            type: TEXT类型  笔记编辑文本
        `
    },
    Textvalue: {
        type: Sequelize.TEXT,
        comment: `
            type: TEXT类型  笔记编辑文本
        `
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null
            type: string类型  笔记创建作者
        `
    },
    uid: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: `
            allowNull: 不允许为null,
            type: int类型  笔记创建作者id
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


Book.sync({
    // force: true
}).then(res => {
    console.log('book表同步成功')
})

module.exports = Book;





