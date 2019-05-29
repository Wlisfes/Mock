/*
 * @Date: 2019-05-29 16:32:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-29 16:46:54
 * @Description: 标签接口操作
 */


import Tags from '../../sql/Model/tags'


export default ({ app, router, Reply }) => {
    //获取全部
    router.get('/all/tags', async(ctx) => {
        try {
            let res = await Tags.findAll()
            Reply(ctx, {
                code: 200,
                message: 'ok',
                data: res
            })
        } catch (error) {
            Reply(ctx, {
                code: 500,
                message: '查询失败！',
                err: error
            })
        }
    })

    //添加
    router.get('/post/tags', async(ctx) => {
        try {
            let model = {
                id: new Date().getTime(),
                name: 'Vue',
                color: "#2C93C5",
                status: 1,
                description: 'Vue.js是一个用于创建用户界面的开源JavaScript框架，也是一个创建单页应用的Web应用框架。',
                author: '情雨随风'
            }
            let res = await Tags.create(model)
            Reply(ctx, {
                code: 200,
                message: 'ok',
                data: res
            })
        } catch (error) {
            Reply(ctx, {
                code: 500,
                message: '添加失败！',
                err: error
            })
        }
    })

    //开放
    router.get('/open/tags', async(ctx) => {
        try {
            let id = ctx.query.id || 1559144847505
            await Tags.update(
                { 'status': 2 },
                {
                    'where': {
                        'id': id
                    }
                }
            )
            let res = await Tags.findOne({
                where: { id }
            })
            Reply(ctx, {
                code: 200,
                message: 'ok',
                data: res
            })
        } catch (error) {
            Reply(ctx, {
                code: 500,
                message: '修改失败！',
                err: error
            })
        }
    })

    //关闭
    router.get('/down/tags', async(ctx) => {
        try {
            let id = ctx.query.id || 1559144847505
            await Tags.update(
                { 'status': 1 },
                {
                    'where': {
                        'id': id
                    }
                }
            )
            let res = await Tags.findOne({
                where: { id }
            })
            Reply(ctx, {
                code: 200,
                message: 'ok',
                data: res
            })
        } catch (error) {
            Reply(ctx, {
                code: 500,
                message: '修改失败！',
                err: error
            })
        }
    })

    //删除
    router.get('/del/tags', async(ctx) => {
        try {
            let id = ctx.query.id || 1559144847505
            await Tags.update(
                { 'status': 0 },
                {
                    'where': {
                        'id': [id]
                    }
                }
            )
            let res = await Tags.findOne({
                where: { id }
            })
            Reply(ctx, {
                code: 200,
                message: 'ok',
                data: res
            })
        } catch (error) {
            Reply(ctx, {
                code: 500,
                message: '删除失败！',
                err: error
            })
        }
    })

    app.use(router.routes(), router.allowedMethods())
}






