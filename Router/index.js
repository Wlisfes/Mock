/*
 * @Date: 2019-05-29 16:04:20
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-30 15:29:43
 * @Description: Router实例
 */


import KoaRouter from 'koa-router'
import validator from '../lib/validator'
import { code } from '../config'
import Tags from './controller/Tags'
import User from './controller/User'

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
        let ctx = this.ctx()
        Tags(ctx)
        User(ctx)
        this.Index()
    }

    ctx() {
        return {
            router: this.router,
            app: this.app,
            validator,
            code,
            Reply: (ctx, coll) => {
                ctx.body = coll
            }
        }
    }
    
}


export default Router;