/*
 * @Date: 2019-05-29 16:04:20
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-30 10:27:34
 * @Description: Router实例
 */


import KoaRouter from 'koa-router'
import Tags from './controller/Tags'

class Router {
    constructor(app, validator) {
        this.app = app
        this.validator = validator
        this.router = KoaRouter({ prefix: '/api' })
    }

    Index() {
        this.app.use(async (ctx, next) => {
            ctx.body = `<h1>Hello World</h1>`
            next()
        })
    }

    Init() {
        let ctx = this.ctx()
        Tags(ctx)
        this.Index()
    }

    ctx() {
        return {
            router: this.router,
            app: this.app,
            validator: this.validator,
            Reply: (ctx, coll) => {
                ctx.body = coll
            }
        }
    }
    
}


export default Router;