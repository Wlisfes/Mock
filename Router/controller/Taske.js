/*
 * @Author: 情雨随风
 * @Date: 2019-06-03 21:59:24
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-08-04 23:41:59
 * @Description: 项目接口操作
 */


import Taske from '../../sql/Model/taske'
import TaskeTags from '../../sql/Model/taskeTags'
const Op = require('sequelize').Op

export default ({ app, router, validator, Reply, code }) => {

    //添加项目
    router.post('/post/taske', 
        validator.isToken({ code ,Reply }),
        validator.isArr({
            key: {
                keys: "tags",
                rule: validator.array().isRequire(),
                message: "tags 不符合规则，必须Array类型且不能为空！",
            },
            child: {
                name: {
                    rule: validator.string().isRequire(),
                    message: "tags is name 不符合规则！"
                },
                color: {
                    rule: validator.test(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/).isRequire(),
                    message: "tags is color 不符合规则！"
                },
                id: {
                    rule: validator.string().isRequire(),
                    message: "tags is id 不符合规则！"
                }
            },
            method: "POST",
            code,
            Reply,
        }),
        validator.isPrams({
            key: {
                name: {
                    rule: validator.string().isRequire(),
                    message: "name 不能为空且必须为字符串！"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 不能为空且必须为字符串！"
                },
                github: {
                    rule: validator.string().isRequire(),
                    message: "github 不能为空且必须为字符串！"
                },
                viewUrl: {
                    rule: validator.string().isRequire(),
                    message: "viewUrl 不能为空且必须为字符！"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let session = ctx.session[code.TOKEN]
                let { name,description,github,viewUrl,tags,weights } = ctx.request.body
                let id = validator.MD5(new Date().getTime())
                let tagsModel = tags.map(el => {
                    return {
                        tag_id: id,
                        tagsfirst_id: el.id,
                        name: el.name,
                        color: el.color
                    }
                })

                await Taske.create({
                    id,
                    uid: session.uid,
                    author: session.nickname,
                    avatar: session.avatar,
                    name,
                    description,
                    status: 1,
                    weights: weights ? weights : 1,
                    suki: 0,
                    github,
                    viewUrl
                })

                await TaskeTags.bulkCreate(tagsModel)
                let res = await Taske.findAll({
                    raw: true,
                    order: [
                        //根据权重排序
                        ['weights', 'desc']
                    ]
                })
                let tagsval = await TaskeTags.findAll({ raw: true })
                let data = res.map(el => {
                    el.tags = tagsval.filter(e => el.id === e.tag_id)
                    return el
                })
                Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error.toString() })
            }
    })


    //获取所有项目
    router.get('/all/taske', async(ctx) => {
        try {
            var res = await Taske.findAll({
                raw: true,
                order: [
                    //根据权重排序
                    ['weights', 'desc']
                ]
            })
            let tagsval = await TaskeTags.findAll({ raw: true })
            let data = res.map(el => {
                el.tags = tagsval.filter(e => el.id === e.tag_id)
                return el
            })
        
            Reply(ctx, { code: code.SUCCESS, message: 'ok', data})
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error.toString() })
        }
    })


    //获取已开放项目
    router.get('/all/open/taske', async(ctx) => {
        try {
            var res = await Taske.findAll({
                raw: true,
                where: { status: 2 },
                order: [
                    //根据权重排序
                    ['weights', 'desc']
                ]
                
            })
            let tagsval = await TaskeTags.findAll({ raw: true })
            let data = res.map(el => {
                el.tags = tagsval.filter(e => el.id === e.tag_id)
                return el
            })
        
            Reply(ctx, { code: code.SUCCESS, message: 'ok', data})
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error.toString() })
        }
    })


    //项目id点赞
    router.get('/suki/taske',
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
                let res = await Taske.findOne({
                    raw: true,
                    where:{ id }
                })
                
                if(res !== null) {
                    await Taske.update({ suki: res.suki + 1 },{ where: { id } })
                    let upres = await Taske.findOne({
                        raw: true,
                        where:{ id }
                    })
                    let tag = await TaskeTags.findAll({
                        raw: true,
                        where: { tag_id: id }
                    })
                    let data = (() => {
                        upres.tags = tag
                        return upres
                    })()

                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                }
                else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '点赞失败！', err: error.toString() })
            }
        }
    )

    //根据用户id获取项目
    router.get('/uid/taske',
        validator.isToken({ code ,Reply }),
        async(ctx) => {
            try {
                let session = ctx.session[code.TOKEN]
                let res = await Taske.findAll({
                    raw: true,
                    where: { uid: session.uid },
                    order: [
                        //根据weights字段倒序排序
                        ['weights', 'desc']
                    ]
                })
                let tag = await TaskeTags.findAll({ raw: true })
                let data = res.map(el => {
                    el.tags = tag.filter(e => el.id === e.tag_id)
                    return el
                })
                
                Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error.toString() })
            }
    })


    //条件查询
    router.post('/find/taske',
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

                    var res = await Taske.findAll({
                        raw: true,
                        where: w,
                        order: [
                            //根据权重排序
                            ['weights', 'desc']
                        ]
                    })
                }
                else {
                    var res = await Taske.findAll({
                        raw: true,
                        where: query,
                        order: [
                            //根据权重排序
                            ['weights', 'desc']
                        ]
                    })
                }

                let tagsval = await TaskeTags.findAll({ raw: true })
                let data = res.map(el => {
                    el.tags = tagsval.filter(e => el.id === e.tag_id)
                    return el
                })

                Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
            }
    })


    //开放
    router.get('/open/taske', 
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
                let up = await Taske.update({ status: 2 }, { where: { id }})

                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await Taske.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Taske.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }

                    let tagsval = await TaskeTags.findAll({ raw: true })
                    let data = res.map(el => {
                        el.tags = tagsval.filter(e => el.id === e.tag_id)
                        return el
                    })

                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '发布失败！', err: error })
            }
    })


    //关闭
    router.get('/down/taske', 
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
                let up = await Taske.update({ status: 1 }, { where: { id }})

                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await Taske.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Taske.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }

                    let tagsval = await TaskeTags.findAll({ raw: true })
                    let data = res.map(el => {
                        el.tags = tagsval.filter(e => el.id === e.tag_id)
                        return el
                    })

                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '关闭失败！', err: error })
            }
    })


    //删除
    router.get('/del/taske', 
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
                let up = await Taske.update({ status: 0 }, { where: { id }})

                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await Taske.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Taske.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }

                    let tagsval = await TaskeTags.findAll({ raw: true })
                    let data = res.map(el => {
                        el.tags = tagsval.filter(e => el.id === e.tag_id)
                        return el
                    })

                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '删除失败！', err: error })
            }
    })


    //根据id修改
    router.post('/update/taske',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isArr({
            key: {
                keys: "tags",
                rule: validator.array().isRequire(),
                message: "tags 不符合规则，必须Array类型且不能为空！",
            },
            child: {
                name: {
                    rule: validator.string().isRequire(),
                    message: "tags is name 不符合规则！"
                },
                color: {
                    rule: validator.test(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/).isRequire(),
                    message: "tags is color 不符合规则！"
                },
                id: {
                    rule: validator.string().isRequire(),
                    message: "tags is id 不符合规则！"
                }
            },
            method: "POST",
            code,
            Reply,
        }),
        validator.isPrams({
            key: {
                id: {
                    rule: validator.string().isRequire(),
                    message: "id 不能为空且必须为字符串！"
                },
                name: {
                    rule: validator.string().isRequire(),
                    message: "name 不能为空且必须为字符串！"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 不能为空且必须为字符串！"
                },
                github: {
                    rule: validator.string().isRequire(),
                    message: "github 不能为空且必须为字符串！"
                },
                viewUrl: {
                    rule: validator.string().isRequire(),
                    message: "viewUrl 不能为空且必须为字符！"
                },
                weights: {
                    rule: validator.number().isRequire(),
                    message: "weights 不能为空且必须为数字！"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let { id,name,description,github,viewUrl,weights,tags } = ctx.request.body

                //根据id跟新数据库
                let upres = await Taske.update(
                    { name,description,github,viewUrl,weights },
                    {where: { id }}
                )

                if(Array.isArray(upres) && upres[0] !== 0) {
                    //筛选项目标签
                    let tagsval = await TaskeTags.findAll({ raw: true })
                    let tg = tagsval.filter(ele => ele.tag_id === id)
                    
                    //查看修改后的标签与修改前的标签是否一致
                    if(!(tg.length === tags.length && tags.every(item => tg.some(ele => item.id === ele.tagsfirst_id)))) {
                        //标签有变化 这里使用方便点的方法  直接删除原有标签在重新插入标签
                        await TaskeTags.destroy({
                            where: {
                                tag_id: id
                            }
                        })
                        let tagsModel = tags.map(el => ({
                                tag_id: id,
                                tagsfirst_id: el.id,
                                name: el.name,
                                color: el.color
                            }))
                        //使用destroy方法批量删除后重新插入新的标签
                        await TaskeTags.bulkCreate(tagsModel)

                        //完成标签更新之后继续往下执行
                    }

                    var res = await Taske.findAll({
                        raw: true,
                        order: [
                            //根据权重排序
                            ['weights', 'desc']
                        ]
                    })
                    let ts = await TaskeTags.findAll({ raw: true })
                    let data = res.map(el => {
                        el.tags = ts.filter(e => el.id === e.tag_id)
                        return el
                    })
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                }
                else {
                    Reply(ctx, { code: code.FAIL, message: '修改失败！', err: error })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    })

    app.use(router.routes(), router.allowedMethods())
}