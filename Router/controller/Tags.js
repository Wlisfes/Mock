/*
 * @Date: 2019-05-29 16:32:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-30 17:53:35
 * @Description: 标签接口操作
 */


import Tags from '../../sql/Model/tags'

export default ({ app, router, validator, Reply, code }) => {
    //添加
    router.post('/post/tags',
        validator.post({
                name: validator.string().isRequire(),
                color: validator.test(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/).isRequire(),
                author: validator.string().isRequire(),
                description: validator.string().isRequire()
            },{
                name: "name 错误",
                color: "color 错误",
                author: "author 错误",
                description: "description 错误"
            },
            code.LACK_ID
        ),
        async(ctx) => {
            try {
                let res = await Tags.create({
                    id: new Date().getTime(),
                    name: ctx.request.body.name,
                    color: ctx.request.body.color,
                    description: ctx.request.body.description,
                    author: ctx.request.body.author
                })
                
                Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error })
            }
    });


    //根据id修改
    router.post('/update/tags',
        validator(
                { body: {
                        id: validator.isRequire()
                }},
            { status: code.LACK_ID, message: "id 缺少" }
        ),
        async(ctx) => {
            try {
                let model = ctx.request.body
                let up = await Tags.update(
                        model,
                    {
                        where: { id: model.id }
                    }
                )
                if(Array.isArray(up) && up[0] !== 0) {
                    let res = await Tags.findAll()

                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.LACK_ID, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    })


    //获取全部
    router.get('/all/tags', async(ctx) => {
        try {
            let res = await Tags.findAll()

            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
        }
    });


    //获取已开放标签
    router.get('/all/open/tags', async(ctx) => {
        try {
            let res = await Tags.findAll({
                where: { status: 2 },
                order: [
                    //根据created_at字段倒序排序
                    ['created_at', 'desc']
                ]
            })
            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
        }
    });


    //获取已关闭标签
    router.get('/all/down/tags', async(ctx) => {
        try {
            let res = await Tags.findAll({
                where: { status: 1 },
                order: [
                    //根据created_at字段倒序排序
                    ['created_at', 'desc']
                ]
            })
            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
        }
    });


    //获取已删除标签
    router.get('/all/del/tags', async(ctx) => {
        try {
            let res = await Tags.findAll({
                where: { status: 0 },
                order: [
                    //根据created_at字段倒序排序
                    ['created_at', 'desc']
                ]
            })
            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
        }
    });


    //根据id查找
    router.get('/id/tags', 
        validator(
            { query: {
                    id: validator.isRequire()
            }},
            { status: code.LACK_ID, message: "id 缺少" }
        ),
        async(ctx) => {            
            try {
                let id = ctx.query.id
                let res = await Tags.findOne({
                    where:{ id }
                })

                if(res !== null) {
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.LACK_ID, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
            }
    });


    //开放
    router.get('/open/tags',
        validator(
            { query: {
                    id: validator.isRequire()
            }},
            { status: code.LACK_ID, message: "id 缺少" }
        ),
        async(ctx) => {
            try {
                let id = ctx.query.id
                let up = await Tags.update(
                    { status: 2 },
                    {
                        where: { id }
                    }
                )
    
                if(Array.isArray(up) && up[0] !== 0) {
                    let res = await Tags.findAll({
                        where: { status: 2 },
                        order: [
                            //根据created_at字段倒序排序
                            ['created_at', 'desc']
                        ]
                    })
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.LACK_ID, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    });


    //关闭
    router.get('/down/tags',
        validator(
            { query: {
                    id: validator.isRequire()
            }},
            { status: code.LACK_ID, message: "id 缺少" }
        ),
        async(ctx) => {
            try {
                let id = ctx.query.id
                let up = await Tags.update(
                    { status: 1 },
                    {
                        where: { id }
                    }
                )

                if(Array.isArray(up) && up[0] !== 0) {
                    let res = await Tags.findAll({
                        where: { status: 2 },
                        order: [
                            //根据created_at字段倒序排序
                            ['created_at', 'desc']
                        ]
                    })

                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.LACK_ID, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    });


    //删除
    router.get('/del/tags',
        validator(
            { query: {
                    id: validator.isRequire()
            }},
            { status: code.LACK_ID, message: "id 缺少" }
        ),
        async(ctx) => {
            try {
                let id = ctx.query.id
                let up = await Tags.update(
                    { status: 0 },
                    {
                        where: { id }
                    }
                )

                if(Array.isArray(up) && up[0] !== 0) {
                    let res = await Tags.findAll({
                        where: { status: 2 },
                        order: [
                            //根据created_at字段倒序排序
                            ['created_at', 'desc']
                        ]
                    })
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.LACK_ID, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '删除失败！', err: error })
            }
    });

    app.use(router.routes(), router.allowedMethods())
}






