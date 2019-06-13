

import Koa from 'koa'
import logger from 'koa-logger'
import cors from 'koa-cors'
import Static from 'koa-static'
import views from 'koa-views'
import bodyparser from 'koa-bodyparser'
import session from 'koa-session'
import Router from './Router'
import { Token } from './config'
const app = new Koa()

app.use(logger())
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}))
app.use(Static(__dirname + '/static'))
app.use(views(__dirname + '/static/src/page', {
    map: {
        html: 'nunjucks'
    }
}))

app.keys = ["lisfes-sigin"]
app.use(session(Token, app))
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))

new Router(app, __dirname + '/static/assets').Init()


const port = process.env.PORT || 9800
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

