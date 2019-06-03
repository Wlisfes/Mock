/*
 * @Date: 2019-05-29 16:04:20
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-03 22:02:37
 * @Description: Router实例
 */


import KoaRouter from 'koa-router'
import validator from '../lib/validator'
import { code } from '../config'
import Tags from './controller/Tags'
import User from './controller/User'
import Article from './controller/Article'
import Taske from './controller/Taske'


class Router {
    constructor(app) {
        this.app = app
        this.router = KoaRouter({ prefix: '/api' })
    }

    Index() {
        this.app.use(async (ctx, next) => {
            await ctx.render('index.html')
            await next()
        })
    }

    Init() {
        let ctx = this.ctx()
        Tags(ctx)
        User(ctx)
        Article(ctx)
        Taske(ctx)
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