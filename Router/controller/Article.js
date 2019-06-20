/*
 * @Author: 情雨随风
 * @Date: 2019-06-01 16:17:26
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-20 17:33:00
 * @Description: 文章接口操作
 */

import Article from '../../sql/Model/article'
import ArticleTags from '../../sql/Model/articleTags'
const Op = require('sequelize').Op

export default ({ app, router, validator, Reply, code }) => {
    //添加文章
    router.post('/post/article',
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
                picture: {
                    rule: validator.string().isRequire(),
                    message: "picture 不能为空且必须为字符串！"
                },
                Textvalue: {
                    rule: validator.string().isRequire(),
                    message: "Textvalue 不能为空且必须为字符！"
                },
                Text: {
                    rule: validator.string().isRequire(),
                    message: "Text 不能为空且必须为字符！"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let session = ctx.session[code.TOKEN]
                let { name,description,read,suki,picture,tags,theme,Text,Textvalue,weights } = ctx.request.body
                let id = validator.MD5(new Date().getTime())
                let tagsModel = tags.map(el => {
                    return {
                        tag_id: id,
                        tagsfirst_id: el.id,
                        name: el.name,
                        color: el.color
                    }
                })
                await Article.create({
                    id,
                    uid: session.uid,
                    name,
                    author: session.nickname,
                    description,
                    theme: theme || "OneDark",
                    Text,
                    Textvalue,
                    picture,
                    read,
                    suki,
                    weights: weights || 1,
                    status: 1
                })
                await ArticleTags.bulkCreate(tagsModel)

                let res = await Article.findAll({ raw: true, order: [ ['weights', 'desc'] ] })
                let tagsval = await ArticleTags.findAll({ raw: true })
                let data = res.map(el => {
                    el.tags = tagsval.filter(e => el.id === e.tag_id)
                    return el
                })

                Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error.toString() })
            }
    })


    //根据id修改
    router.post('/update/article',
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
                Textvalue: {
                    rule: validator.string().isRequire(),
                    message: "Textvalue 不能为空且必须为字符！"
                },
                Text: {
                    rule: validator.string().isRequire(),
                    message: "Text 不能为空且必须为字符！"
                },
                theme: {
                    rule: validator.string().isRequire(),
                    message: "theme 不能为空且必须为字符！"
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
                let { id,name,description,Textvalue,Text,theme,weights,read,suki,tags } = ctx.request.body
                //根据id跟新数据库
                let upres = await Article.update(
                    { 
                        name,description,Text,
                        Textvalue,theme,weights,
                        read: read || 1,
                        suki: suki || 1
                    },
                    { where: { id }}
                )

                if(Array.isArray(upres) && upres[0] !== 0) {
                    //筛选项目标签
                    let tagsval = await ArticleTags.findAll({ raw: true })
                    let tg = tagsval.filter(ele => ele.tag_id === id)

                    //查看修改后的标签与修改前的标签是否一致
                    if(!(tg.length === tags.length && tags.every(item => tg.some(ele => item.id === ele.tagsfirst_id)))) {
                        //标签有变化 这里使用方便点的方法  直接删除原有标签在重新插入标签
                        await ArticleTags.destroy({
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
                        await ArticleTags.bulkCreate(tagsModel)

                        //完成标签更新之后继续往下执行
                    }

                    let res = await Article.findAll({ raw: true })
                    let ts = await ArticleTags.findAll({ raw: true })
                    let data = res.map(el => {
                        el.tags = ts.filter(e => el.id === e.tag_id)
                        return el
                    })
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                }
                else {
                    Reply(ctx, { code: code.FAIL, message: '修改失败！' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error.toString() })
            }
    })


    //获取全部
    router.get('/all/article', async(ctx) => {
        try {
            let res = await Article.findAll({ raw: true, order: [ ['weights', 'desc'] ] })
            let tag = await ArticleTags.findAll({ raw: true })
            let data = res.map(el => {
                el.tags = tag.filter(e => el.id === e.tag_id)
                return el
            })
            
            Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error.toString() })
        }
    });


    //获取已开放文章
    router.get('/all/open/article', async(ctx) => {
        try {
            let res = await Article.findAll({
                raw: true,
                where: { status: 2 },
                order: [
                    //根据weights字段倒序排序
                    ['weights', 'desc']
                ]
            })

            let tag = await ArticleTags.findAll({ raw: true })
            let data = res.map(el => {
                el.tags = tag.filter(e => el.id === e.tag_id)
                return el
            })

            Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error.toString() })
        }
    })

    //获取已关闭文章
    router.get('/all/down/article', async(ctx) => {
        try {
            let res = await Article.findAll({
                raw: true,
                where: { status: 1 },
                order: [
                    //根据weights字段倒序排序
                    ['weights', 'desc']
                ]
            })
            let tag = await ArticleTags.findAll({ raw: true })
            let data = res.map(el => {
                el.tags = tag.filter(e => el.id === e.tag_id)
                return el
            })

            Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error.toString() })
        }
    })

    //获取已关闭文章
    router.get('/all/del/article', async(ctx) => {
        try {
            let res = await Article.findAll({
                raw: true,
                where: { status: 0 },
                order: [
                    //根据weights字段倒序排序
                    ['weights', 'desc']
                ]
            })
            let tag = await ArticleTags.findAll({ raw: true })
            let data = res.map(el => {
                el.tags = tag.filter(e => el.id === e.tag_id)
                return el
            })

            Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error.toString() })
        }
    })

    //开放文章
    router.get('/open/article',
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
                let up = await Article.update({ status: 2 }, { where: { id }})
    
                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await Article.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Article.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    let tag = await ArticleTags.findAll({ raw: true })
                    let data = res.map(el => {
                        el.tags = tag.filter(e => el.id === e.tag_id)
                        return el
                    })
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error.toString() })
            }
    })

    //关闭文章
    router.get('/down/article',
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
                let up = await Article.update({ status: 1 }, { where: { id }})
    
                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await Article.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Article.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    let tag = await ArticleTags.findAll({ raw: true })
                    let data = res.map(el => {
                        el.tags = tag.filter(e => el.id === e.tag_id)
                        return el
                    })

                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error.toString() })
            }
    })

    //删除文章
    router.get('/del/article',
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
                let up = await Article.update({ status: 0 }, { where: { id }})
    
                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await Article.findAll({
                            raw: true,
                            where: { status: 2 },
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    else {
                        var res = await Article.findAll({
                            raw: true,
                            order: [
                                //根据权重排序
                                ['weights', 'desc']
                            ]
                        })
                    }
                    let tag = await ArticleTags.findAll({ raw: true })
                    let data = res.map(el => {
                        el.tags = tag.filter(e => el.id === e.tag_id)
                        return el
                    })
                    
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error.toString() })
            }
    })

    //根据id查找文章  此接口每调用一次会增加一次阅读数
    router.get('/id/article',
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
                let upres = await Article.findOne({
                    raw: true,
                    where:{ id }
                })
                
                if(upres !== null) {
                    await Article.update({ read: upres.read + 1 },{ where: { id } })
                    let res = await Article.findOne({
                        raw: true,
                        where:{ id }
                    })
                    let tag = await ArticleTags.findAll({
                        raw: true,
                        where: { tag_id: id }
                    })

                    let data = ((el) => {
                        el.tags = tag
                        return el
                    })(res)

                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
                }
                else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error.toString() })
            }
    })

    //文章点赞
    router.get('/suki/article',
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
                let res = await Article.findOne({
                    raw: true,
                    where:{ id }
                })
                
                if(res !== null) {
                    await Article.update({ suki: res.suki + 1 },{ where: { id } })
                    let upres = await Article.findOne({
                        raw: true,
                        where:{ id }
                    })
                    let tag = await ArticleTags.findAll({
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

    
    //条件查询
    router.post('/find/article',
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

                    var res = await Article.findAll({
                        raw: true,
                        where: w,
                        order: [
                            //根据权重排序
                            ['weights', 'desc']
                        ]
                    })
                }
                else {
                    var res = await Article.findAll({
                        raw: true,
                        where: query,
                        order: [
                            //根据权重排序
                            ['weights', 'desc']
                        ]
                    })
                }

                let tagsval = await ArticleTags.findAll({ raw: true })
                let data = res.map(el => {
                    el.tags = tagsval.filter(e => el.id === e.tag_id)
                    return el
                })

                Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
            } catch (error) {
                console.log(error)
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
            }
    })
    

    app.use(router.routes(), router.allowedMethods())
}
