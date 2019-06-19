/*
 * @Author: 情雨随风
 * @Date: 2019-06-01 16:17:26
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-19 13:19:57
 * @Description: 文章接口操作
 */

import Article from '../../sql/Model/article'
import ArticleTags from '../../sql/Model/articleTags'

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
                title: {
                    rule: validator.string().isRequire(),
                    message: "title 不能为空且必须为字符串！"
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
                let { title,description,read,suki,picture,tags,theme,Text,Textvalue,weights } = ctx.request.body
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
                    title,
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

    

    app.use(router.routes(), router.allowedMethods())
}
