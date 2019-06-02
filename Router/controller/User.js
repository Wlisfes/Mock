/*
 * @Date: 2019-05-29 16:32:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-02 11:40:27
 * @Description: 用户接口操作
 */


import User from '../../sql/Model/user'

export default ({ app, router, validator, Reply, code }) => {
    
    //注册用户
    router.post('/post/user',
        validator.isPrams({
            key: {
                phone: {
                    rule: validator.test(/^1([38][0-9]|4[012345789]|5[0-3,4-9]|6[6]|7[01345678]|9[89])\d{8}$/).isRequire(),
                    message: "phone 不能为空且必须符合标准"
                },
                password: {
                    rule: validator.string().isRequire(),
                    message: "password 不能为空且不能是纯数字"
                },
                nickname: {
                    rule: validator.string().isRequire(),
                    message: "nickname 错误"
                },
                sex: {
                    rule: validator.number().isRequire(),
                    message: "sex 错误"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 错误"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let up = await User.findOne({
                    where: { phone: ctx.request.body.phone }
                })

                if (up !== null) {
                    Reply(ctx, { code: code.FAIL, message: '手机号已被注册！' })
                } else {
                    let res = await User.create({
                        uid: new Date().getTime(),
                        phone: ctx.request.body.phone,
                        password: ctx.request.body.password,
                        nickname: ctx.request.body.nickname,
                        sex: ctx.request.body.sex,
                        description: ctx.request.body.description,
                        avatar: "1557678889694.jpg",
                        status: 2
                    })
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res})
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '注册失败！', err: error })
            }
    });

     
    //获取所有用户
    router.get('/all/user',
        validator.isToken({ code ,Reply }),
        async(ctx) => {
            try {
                let res = await User.findAll()

                Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
            }
    });


    //登陆
    router.post('/login/user',
        validator.isPrams({
            key: {
                phone: {
                    rule: validator.test(/^1([38][0-9]|4[012345789]|5[0-3,4-9]|6[6]|7[01345678]|9[89])\d{8}$/).isRequire(),
                    message: "phone 不能为空且必须符合标准"
                },
                password: {
                    rule: validator.isRequire(),
                    message: "password 不能为空"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let up = await User.findOne({
                    where: { phone: ctx.request.body.phone }
                })
                if (up !== null) {
                    if(up.password === ctx.request.body.password) {
                        ctx.session[code.TOKEN] = up
                        Reply(ctx, { code: code.SUCCESS, message: 'ok', data: up })
                    } else {
                        Reply(ctx, { code: code.FAIL, message: '密码错误！' })
                    }
                } else {
                    Reply(ctx, { code: code.FAIL, message: '手机号未注册！' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '登陆失败！', err: error })
            }
    })


    //修改密码
    router.post('/update/user/pssw',
        validator.isPrams({
            key: {
                phone: {
                    rule: validator.test(/^1([38][0-9]|4[012345789]|5[0-3,4-9]|6[6]|7[01345678]|9[89])\d{8}$/).isRequire(),
                    message: "phone 不能为空且必须符合标准"
                },
                password: {
                    rule: validator.string().isRequire(),
                    message: "password 不能为空且不能是纯数字"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let up = await User.findOne({
                    where: { phone: ctx.request.body.phone }
                })

                if(up !== null) {
                    let upRes = await User.update(
                        { password: ctx.request.body.password },
                        {
                            where: { phone: ctx.request.body.phone }
                        }
                    )
                    if(Array.isArray(upRes) && up[0] !== 0) {
                        let res = await User.findOne({ where: { phone: ctx.request.body.phone }})

                        Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                    } else {
                        Reply(ctx, { code: code.FAIL, message: '修改失败！' })
                    }
                } else {
                    Reply(ctx, { code: code.FAIL, message: '手机号未注册！' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    })


    //更换手机号
    router.post('/update/user/phone',
        validator.isToken({ code ,Reply }),
        validator.isPrams({
            key: {
                uid: {
                    rule: validator.isRequire(),
                    message: "uid 不能为空"
                },
                phone: {
                    rule: validator.test(/^1([38][0-9]|4[012345789]|5[0-3,4-9]|6[6]|7[01345678]|9[89])\d{8}$/).isRequire(),
                    message: "phone 不能为空且必须符合标准"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let up = await User.findOne({
                    where: { uid: ctx.request.body.uid }
                })

                if(up !== null) {
                    let upRes = await User.update(
                        { phone: ctx.request.body.phone },
                        {
                            where: { uid: ctx.request.body.uid }
                        }
                    )
                    if(Array.isArray(upRes) && up[0] !== 0) {
                        let res = await User.findOne({ where: { phone: ctx.request.body.phone }})

                        Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                    } else {
                        Reply(ctx, { code: code.FAIL, message: '修改失败！' })
                    }
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'uid 错误！' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    })

    app.use(router.routes(), router.allowedMethods())
}


