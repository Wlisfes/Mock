/*
 * @Author: 情雨随风
 * @Date: 2019-06-16 21:34:12
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-16 23:51:26
 * @Description: 友链接口操作
 */


import GitHub from '../../sql/Model/github'

export default ({ app, router, validator, Reply, code }) => {

    //新增友链接
    router.post('/post/github',
        validator.isToken({ code ,Reply }),
        validator.isPrams({
            key: {
                githubName: {
                    rule: validator.string().isRequire(),
                    message: "githubName 不能为空且必须为字符串！"
                },
                github: {
                    rule: validator.string().isRequire(),
                    message: "github 不能为空且必须为字符串！"
                },
                sex: {
                    rule: validator.number().isRequire(),
                    message: "sex 不能为空且必须为数组1 ~ 2！"
                },
                name: {
                    rule: validator.string().isRequire(),
                    message: "name 不能为空且必须为字符！"
                },
                address: {
                    rule: validator.string().isRequire(),
                    message: "address 不能为空且必须为字符！"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 不能为空且必须为字符！"
                },
                githubAvatar: {
                    rule: validator.string().isRequire(),
                    message: "githubAvatar 不能为空且必须为字符！"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let session = ctx.session[code.TOKEN]
                let { githubName,github,sex,name,address,description,githubAvatar,weights,blog } = ctx.request.body
                let id = validator.MD5(new Date().getTime())
                
                await GitHub.create({
                    id,
                    uid: session.uid,
                    avatar: session.avatar,
                    nickname: session.nickname,
                    githubName,
                    github,
                    blog: blog || "",
                    sex,
                    name,
                    address,
                    weights: weights || 1,
                    description,
                    githubAvatar,
                    status: 1
                })

                let res = await GitHub.findAll({ raw: true, order: [ ['weights', 'desc'] ] })

                Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error.toString() })
            }
    })


    //获取全部友链
    router.get('/all/github', async(ctx) => {
        try {
            let res = await GitHub.findAll({ raw: true, order: [ ['weights', 'desc'] ] })
            
            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error.toString() })
        }
    })


    //开放
    router.get('/open/github', 
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
        async (ctx) => {
            try {
                let id = ctx.query.id
                let up = await GitHub.update({ status: 2 }, { where: { id }})

                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await GitHub.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await GitHub.findAll({
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
                Reply(ctx, { code: code.REEOR, message: '发布失败！', err: error })
            }
    })


    //关闭
    router.get('/down/github', 
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
        async (ctx) => {
            try {
                let id = ctx.query.id
                let up = await GitHub.update({ status: 1 }, { where: { id }})

                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await GitHub.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await GitHub.findAll({
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
                Reply(ctx, { code: code.REEOR, message: '关闭失败！', err: error })
            }
    })


    //关闭
    router.get('/del/github', 
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
        async (ctx) => {
            try {
                let id = ctx.query.id
                let up = await GitHub.update({ status: 0 }, { where: { id }})

                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await GitHub.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await GitHub.findAll({
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
                Reply(ctx, { code: code.REEOR, message: '删除失败！', err: error })
            }
    })


    //根据id修改
    router.post('/update/github',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isPrams({
            key: {
                id: {
                    rule: validator.string().isRequire(),
                    message: "id 不能为空且必须为字符串！"
                },
                githubName: {
                    rule: validator.string().isRequire(),
                    message: "githubName 不能为空且必须为字符串！"
                },
                github: {
                    rule: validator.string().isRequire(),
                    message: "github 不能为空且必须为字符串！"
                },
                sex: {
                    rule: validator.number().isRequire(),
                    message: "sex 不能为空且必须为数组1 ~ 2！"
                },
                name: {
                    rule: validator.string().isRequire(),
                    message: "name 不能为空且必须为字符！"
                },
                address: {
                    rule: validator.string().isRequire(),
                    message: "address 不能为空且必须为字符！"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 不能为空且必须为字符！"
                },
                githubAvatar: {
                    rule: validator.string().isRequire(),
                    message: "githubAvatar 不能为空且必须为字符！"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let { id,githubName,github,sex,name,address,description,githubAvatar,weights,blog } = ctx.request.body
                //根据id跟新数据库
                let modal = {
                    githubName,
                    github,
                    sex,
                    name,
                    address,
                    description,
                    githubAvatar,
                    blog,
                    weights: weights || 1
                }
                let upres = await GitHub.update(modal, {where: { id }})
                if(Array.isArray(upres) && upres[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await GitHub.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await GitHub.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                }
                else {
                    Reply(ctx, { code: code.FAIL, message: '修改失败！' })
                }
            } catch (error) {
                console.log(error)
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error.toString() })
            }
    })


    app.use(router.routes(), router.allowedMethods())
}