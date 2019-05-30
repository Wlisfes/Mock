

import Koa from 'koa'
import logger from 'koa-logger'
import cors from 'koa-cors'
import bodyparser from 'koa-bodyparser'
import Router from './Router'
const app = new Koa()

app.use(logger())
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}))
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))

new Router(app).Init()


const port = process.env.PORT || 9800
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

