/*
 * @Date: 2019-05-29 16:32:08
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-30 17:53:35
 * @Description: 用户接口操作
 */


import User from '../../sql/Model/user'

export default ({ app, router, validator, Reply, code }) => {
    
    //注册用户
    router.post('/post/user',
        validator.post({
                phone: validator.test(/^1([38][0-9]|4[012345789]|5[0-3,4-9]|6[6]|7[01345678]|9[89])\d{8}$/).isRequire(),
                password: validator.isRequire(),
                nickname: validator.string().isRequire(),
                sex: validator.number().isRequire(),
                description: validator.string().isRequire()
            },{
                phone: "phone 错误",
                password: "password 错误",
                nickname: "nickname 错误",
                sex: "sex 错误",
                description: "description 错误"
            },
            code.LACK_ID
        ),
        async(ctx) => {
            try {
                let res = await User.create({
                    uid: new Date().getTime(),
                    phone: ctx.request.body.phone,
                    password: ctx.request.body.password.toString(),
                    nickname: ctx.request.body.nickname,
                    sex: ctx.request.body.sex,
                    description: ctx.request.body.description,
                    avatar: "1557678889694.jpg"
                })

                Reply(ctx, { code: code.REEOR, message: 'ok', data: res})
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
            }
    });

    
    //获取所有用户
    router.get('/all/user', async(ctx) => {
        try {
            let res = await User.findAll()

            Reply(ctx, { code: code.SUCCESS, message: 'ok', data: res })
        } catch (error) {
            Reply(ctx, { code: code.REEOR, message: '查询失败！', err: error })
        }
    });



    app.use(router.routes(), router.allowedMethods())
}


