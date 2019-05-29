/*
 * @Date: 2019-05-29 16:32:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-29 16:46:54
 * @Description: 标签接口操作
 */


import Tags from '../../sql/Model/tags'



export const getAllTags = async (ctx) => {
    try {
        let res = await Tags.findAll()


        ctx.body = res
    } catch (error) {
        
    }
}






