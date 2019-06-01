/*
 * @Author: 情雨随风
 * @Date: 2019-06-01 16:17:26
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-02 00:43:02
 * @Description: 文章接口操作
 */

import Article from '../../sql/Model/article'

export default ({ app, router, validator, Reply, code }) => {
    //添加文章
    router.post('/post/article',
        validator.isToken(code),
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
                context: {
                    rule: validator.string().isRequire(),
                    message: "context 不能为空且必须为字符串！"
                },
                picture: {
                    rule: validator.string().isRequire(),
                    message: "picture 不能为空且必须为字符！"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let session = ctx.session[code.TOKEN]
                let { title,description,context,picture } = ctx.request.body
                let model = {
                    id: validator.MD5(new Date().getTime()),
                    uid: session.uid,
                    title: title,
                    author: session.nickname,
                    description: description,
                    context: context,
                    picture: picture
                }

                // let res = await Article.create(model)

                Reply(ctx, { code: code.SUCCESS, message: 'ok', data: model })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '添加失败！', err: error })
            }
    })

    //获取全部
    router.get('/all/article', async(ctx) => {
        try {
            let res = await Article.findAll()

            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
        }
    });

    app.use(router.routes(), router.allowedMethods())
}
