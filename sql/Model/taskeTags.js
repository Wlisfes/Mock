/*
 * @Date: 2019-06-04 15:27:58
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-04 15:37:11
 * @Description: 项目标签子表
 */


const Sequelize = require('sequelize')
const db = require('../db')


const TaskeTags = db.define('taske_tags', {
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


// TaskeTags.sync({
//     force: true
// })

TaskeTags.sync()
    .then(res => {
    console.log('taske_tags表同步成功')
})

module.exports = TaskeTags;





