

import Koa from 'koa'
import logger from 'koa-logger'
import cors from 'koa-cors'
import validator from './lib/validator'
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

new Router(app, validator).Init()


const port = process.env.PORT || 9800
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

