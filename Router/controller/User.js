/*
 * @Date: 2019-05-29 16:32:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-17 23:18:54
 * @Description: 用户接口操作
 */


import User from '../../sql/Model/user'

export default ({ app, router, validator, Reply, code }) => {
    
    //注册用户
    router.post('/post/user',
        validator.isAdmin({ code ,Reply }),
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
                age: {
                    rule: validator.number().isRequire(),
                    message: "age 错误"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 错误"
                },
                admin: {
                    rule: validator.string().isRequire(),
                    message: "admin 错误"
                },
                avatar: {
                    rule: validator.string().isRequire(),
                    message: "avatar 错误"
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
                    let { phone,password,nickname,sex,age,description,avatar,admin } = ctx.request.body
                    let uid = validator.MD5(new Date().getTime())
                    let res = await User.create({
                        uid,
                        phone,
                        password: validator.MD5(password),
                        nickname,
                        sex,
                        age,
                        description,
                        admin: admin || 'same',
                        avatar: avatar
                    })
                    Reply(ctx, { code: code.SUCCESS, message: 'ok' , data: res })
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
                let res = await User.findAll({ raw: true })
                // let res = await User.findAll({
                //     order: [
                //         //根据created_at字段倒序排序
                //         ['created_at', 'desc']
                //     ]
                // })

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
                    if(up.status === 2) {
                        if(up.password === validator.MD5(ctx.request.body.password)) {
                            validator.setStore( ctx, code.TOKEN, up)
                            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: up })
                        } else {
                            Reply(ctx, { code: code.FAIL, message: '密码错误！' })
                        }
                    }
                    else {
                        Reply(ctx, { code: code.FAIL, message: '账户已被禁用，请联系超级管理员解除！' })
                    }
                } else {
                    Reply(ctx, { code: code.FAIL, message: '手机号未注册！' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '登陆失败！', err: error.toString() })
            }
    })

    //登出
    router.get('/logout/user',
        validator.isToken({ code ,Reply }),
        async(ctx) => {
            validator.removeStore(ctx, code.TOKEN)
            Reply(ctx, { code: code.SUCCESS, message: 'ok' })
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
                        { password: validator.MD5(ctx.request.body.password) },
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


    //修改账户信息
    router.post('/update/user',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isPrams({
            key: {
                uid: {
                    rule: validator.string().isRequire(),
                    message: "uid 错误"
                },
                nickname: {
                    rule: validator.string().isRequire(),
                    message: "nickname 错误"
                },
                sex: {
                    rule: validator.number().isRequire(),
                    message: "sex 错误"
                },
                age: {
                    rule: validator.number().isRequire(),
                    message: "age 错误"
                },
                description: {
                    rule: validator.string().isRequire(),
                    message: "description 错误"
                },
                admin: {
                    rule: validator.string().isRequire(),
                    message: "admin 错误"
                }
            },
            method: "POST",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let { nickname,sex,age,description,uid,admin } = ctx.request.body
                let up = await User.findOne({ where: { uid } })

                if (up == null) {
                    Reply(ctx, { code: code.FAIL, message: 'uid错误，无法查找用户信息！' })
                }
                else {
                    let update = await User.update(
                        { nickname,sex,age,description,admin },
                        { where: { uid } })

                    if(Array.isArray(update) && update[0] !== 0) {
                        let res = await User.findAll({ raw: true })
                        Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                    }
                    else {
                        Reply(ctx, { code: code.FAIL, message: '修改失败！' })
                    }
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    })


    //开放用户
    router.get('/open/user',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isPrams({
            key: {
                uid: {
                    rule: validator.isRequire(),
                    message: "uid 缺少！"
                }
            },
            method: "GET",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let uid = ctx.query.uid
                let up = await User.update({ status: 2 }, { where: { uid }})
    
                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await User.findAll({
                            raw: true,
                            where: { status: 2 },
                            // order: [
                            //     //根据权重排序
                            //     ['weights', 'desc']
                            // ]
                        })
                    }
                    else {
                        var res = await User.findAll({
                            raw: true,
                            // order: [
                            //     //根据权重排序
                            //     ['weights', 'desc']
                            // ]
                        })
                    }
    
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    })


    //关闭用户
    router.get('/down/user',
        validator.isToken({ code ,Reply }),
        validator.isAdmin({ code ,Reply }),
        validator.isPrams({
            key: {
                uid: {
                    rule: validator.isRequire(),
                    message: "uid 缺少！"
                }
            },
            method: "GET",
            code,
            Reply
        }),
        async(ctx) => {
            try {
                let uid = ctx.query.uid
                let up = await User.update({ status: 1 }, { where: { uid }})
    
                if(Array.isArray(up) && up[0] !== 0) {
                    if(ctx.query.status == 2) {
                        var res = await User.findAll({
                            raw: true,
                            where: { status: 2 },
                            // order: [
                            //     //根据权重排序
                            //     ['weights', 'desc']
                            // ]
                        })
                    }
                    else {
                        var res = await User.findAll({
                            raw: true,
                            // order: [
                            //     //根据权重排序
                            //     ['weights', 'desc']
                            // ]
                        })
                    }
    
                    Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
                } else {
                    Reply(ctx, { code: code.FAIL, message: 'id 错误' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '修改失败！', err: error })
            }
    })

    app.use(router.routes(), router.allowedMethods())
}


