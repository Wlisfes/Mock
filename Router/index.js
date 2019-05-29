/*
 * @Date: 2019-05-29 16:04:20
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-29 17:23:18
 * @Description: Router实例
 */


import KoaRouter from 'koa-router'
import * as Tags from './controller/Tags'

class Router {
    constructor(app) {
        this.app = app
        this.router = KoaRouter({ prefix: '/api' })
    }

    Index() {
        this.app.use(async (ctx, next) => {
            ctx.body = `<h1>Hello World</h1>`
            next()
        })
    }

    Init() {
        let Api = this.router
        Api.get('/', async(ctx) => {
            ctx.body = `<h1>接口首页</h1>`
        })

        this.Index()
        this.Mount(Api)
    }

    Mount(Api) {
        this.app
            .use(Api.routes())
            .use(Api.allowedMethods())
    }
}


export default Router;