/*
 * @Date: 2019-05-29 16:32:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-10 23:04:27
 * @Description: 标签接口操作
 */


import Tags from '../../sql/Model/tags'
const Op = require('sequelize').Op

export default ({ app, router, validator, Reply, code }) => {
    //添加
    router.post('/post/tags',
        validator.isToken({ code ,Reply }),
        validator.isPrams({
            key: {
                name: {
                    rule: validator.string().isRequire(),
                    message: "name 不能为空且必须为字符串"
                },
                color: {
                    rule: validator.test(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/).isRequire(),
                    message: "color 不能为空且必须符合十六进制颜色"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 不能为空切必须为字符串"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let session = ctx.session[code.TOKEN]
                let up = await Tags.findOne({ where: { name: ctx.request.body.name }})
                if (up !== null) {
                    Reply(ctx, { code: code.FAIL, message: '标签已存在！', data: up })
                } else {
                    let { name,color,description,weights } = ctx.request.body
                    let id = validator.MD5(new Date().getTime())
                    let res = await Tags.create({
                        id,
                        uid: session.uid,
                        author: session.nickname,
                        name,
                        color,
                        description,
                        weights: weights ? weights : 1
                    })
                    
                    if(res) {
                        let upres = await Tags.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                        
                        Reply(ctx, { code: code.SUCCESS, message: 'ok', data: upres })
                    } else {
                        Reply(ctx, { code: code.FAIL, message: '添加数据失败！' })
                    }
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error })
            }
    });


    //根据id修改
    router.post('/update/tags',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isPrams({
            key: {
                id: {
                    rule: validator.isRequire(),
                    message: "id 缺少！"
                },
                name: {
                    rule: validator.string().isRequire(),
                    message: "name 不能为空且必须为字符串"
                },
                color: {
                    rule: validator.test(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/).isRequire(),
                    message: "color 不能为空且必须符合十六进制颜色"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 不能为空切必须为字符串"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let { id, name, color, description, weights } = ctx.request.body
                let up = await Tags.findAll({ where: { name }})
                if(up.length > 1) {
                    Reply(ctx, { code: code.FAIL, message: '标签已存在！', data: up })
                }
                else {
                    let upres = await Tags.update(
                        { name,color,description,weights: weights?weights:1 },
                        {where: { id }}
                    )
                    if(Array.isArray(upres) && upres[0] !== 0) {
                        let res = await Tags.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })

                        Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                    } else {
                        Reply(ctx, { code: code.LACK_ID, message: 'id 错误' })
                    }
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    })


    //获取全部
    router.get('/all/tags', async(ctx) => {
        try {
            let res = await Tags.findAll({
                raw: true,
                order: [
                    //根据权重排序
                    ['weights', 'desc']
                ]
            })

            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
        }
    });


    //获取已开放标签
    router.get('/all/open/tags', async(ctx) => {
        try {
            let res = await Tags.findAll({
                raw: true,
                where: { status: 2 },
                order: [
                    //根据权重排序
                    ['weights', 'desc']
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
                raw: true,
                where: { status: 1 },
                order: [
                    //根据权重排序
                    ['weights', 'desc']
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
                raw: true,
                where: { status: 0 },
                order: [
                    //根据权重排序
                    ['weights', 'desc']
                ]
            })
            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
        }
    });


    //根据id查找
    router.get('/id/tags',
        validator.isPrams({
            key: {
                id: {
                    rule: validator.isRequire(),
                    message: "id 缺少！"
                }
            },
            method: "GET",
            code,
            Reply
        }),
        async(ctx) => {            
            try {
                let id = ctx.query.id
                let res = await Tags.findOne({
                    where:{ id }
                })

                if(res !== null) {
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
            }
    });


    //条件查询
    router.post('/find/tags',
        async(ctx) => {
            try {
                let query = ctx.request.body
                if(query.first && query.last) {
                    let w = {}
                    for(let k in query) {
                        if(k != 'first' && k != 'last') {
                            w[k] = query[k]
                        }
                    }
                    w.createdAt = {
                        [Op.gte]: `${query.first} 00:00:00`,
                        [Op.lte]: `${query.last} 23:59:59`
                    }

                    var res = await Tags.findAll({
                        raw: true,
                        where: w,
                        order: [
                            //根据权重排序
                            ['weights', 'desc']
                        ]
                    })
                }
                else {
                    var res = await Tags.findAll({
                        raw: true,
                        where: query,
                        order: [
                            //根据权重排序
                            ['weights', 'desc']
                        ]
                    })
                }

                Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
            }
    })

    //开放
    router.get('/open/tags',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isPrams({
            key: {
                id: {
                    rule: validator.isRequire(),
                    message: "id 缺少！"
                }
            },
            method: "GET",
            code,
            Reply
        }),
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
                    if(ctx.query.status == 2) {
                        var res = await Tags.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Tags.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    });


    //关闭
    router.get('/down/tags',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isPrams({
            key: {
                id: {
                    rule: validator.isRequire(),
                    message: "id 缺少！"
                }
            },
            method: "GET",
            code,
            Reply
        }),
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
                    if(ctx.query.status == 2) {
                        var res = await Tags.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Tags.findAll({
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    });


    //删除
    router.get('/del/tags',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isPrams({
            key: {
                id: {
                    rule: validator.isRequire(),
                    message: "id 缺少！"
                }
            },
            method: "GET",
            code,
            Reply
        }),
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
                    if(ctx.query.status == 2) {
                        var res = await Tags.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Tags.findAll({
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '删除失败！', err: error })
            }
    });

    app.use(router.routes(), router.allowedMethods())
}






