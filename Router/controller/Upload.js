/*
 * @Author: 情雨随风
 * @Date: 2019-06-13 22:05:23
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-14 00:00:28
 * @Description: 图片上传
 */


import uploadFile from '../../lib/upcofn'

export default ({ app, router, validator, Reply, code }, path) => {
    
    //上传图片
    router.post('/upload',
        async (ctx) => {
            try {
                let res = await uploadFile( ctx, {
                    fileType: 'album',
                    path: path
                })

                if (res.success) {
                    Reply(ctx, { code: 200, message: 'ok', data: res.data })
                } else {
                    Reply(ctx, { code: code.FAIL, message: '上传失败' })
                }
            } catch (error) {
                Reply(ctx, { code: code.REEOR, message: '上传失败', err: error.toString() })
            }
    })

    app.use(router.routes(), router.allowedMethods())
}