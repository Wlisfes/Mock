/*
 * @Date: 2019-05-29 16:04:20
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-14 23:03:26
 * @Description: Router实例
 */


import KoaRouter from 'koa-router'
import validator from '../lib/validator'
import { code } from '../config'
import Upload from './controller/Upload'
import Tags from './controller/Tags'
import User from './controller/User'
import Article from './controller/Article'
import Taske from './controller/Taske'
import Book from './controller/Book'

class Router {
    constructor(app, path) {
        this.app = app
        this.path = path
        this.router = KoaRouter({ prefix: '/api' })
    }

    Index() {
        this.router.get('/', async (ctx, next) => {
            await ctx.render('index.html')
            await next()
        })
        this.app.use(this.router.routes(), this.router.allowedMethods())
    }

    Init() {
        let ctx = this.ctx()
        Upload(ctx, this.path)
        Tags(ctx)
        User(ctx)
        Article(ctx)
        Taske(ctx)
        Book(ctx)
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