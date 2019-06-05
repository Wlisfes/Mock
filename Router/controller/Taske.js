/*
 * @Author: 情雨随风
 * @Date: 2019-06-03 21:59:24
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-04 15:47:51
 * @Description: 项目接口操作
 */


import Taske from '../../sql/Model/taske'
import TaskeTags from '../../sql/Model/taskeTags'

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
                let { name,description,github,viewUrl,tags } = ctx.request.body
                let id = validator.MD5(new Date().getTime())
                let tagsModel = tags.map(el => {
                    return {
                        tag_id: id,
                        tagsfirst_id: el.id,
                        name: el.name,
                        color: el.color
                    }
                })

                let res = await Taske.create({
                    id,
                    uid: session.uid,
                    author: session.nickname,
                    avatar: session.avatar,
                    name,
                    description,
                    status: 1,
                    suki: 0,
                    github,
                    viewUrl
                })

                let tagsval = await TaskeTags.bulkCreate(tagsModel)
                let data = (() => {
                    let el = res.get()
                    el.tags = tagsval
                    return el
                })()

                Reply(ctx, { code: code.SUCCESS, message: 'ok', data })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error.toString() })
            }
    })









    app.use(router.routes(), router.allowedMethods())
}