/*
 * @Author: 情雨随风
 * @Date: 2019-05-31 23:31:08
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-02 00:08:32
 * @Description: 
 */


axios.defaults.baseURL='http://localhost:9800'

//请求拦截器
axios.interceptors.request.use(res => res, err => Promise.reject(err))
//响应拦截器
axios.interceptors.response.use( res => res,err => err )


class HttpApi {
    constructor(vm) {
        this.vm = vm
    }
    get = async (url, param) => axios.get(url, { params: { ...param }}).then(res => res.data).catch(e => e)
    post = async (url, param) => axios.post(url, { ...param }).then(res => res.data).catch(e => e)

    //注册
    async postUser() {
        try {
            let res = await this.post(`/api/post/user`,{
                phone: 18676361342,
                password: "000000",
                nickname: "情雨随风",
                sex: 2,
                description: "项目开发者, 超级管理员！"
            })
            console.log(res)
            if(res.code === 200) 
                this.vm.$message({
                    message: res.message,
                    type: 'success'
                })
            else
                this.vm.$message.error(res.message)
        } catch (error) {
            this.vm.$message.error('server 奔溃')
        }
    }

    //登录
    async loginUser() {
        try {
            let res = await this.post(`/api/login/user`,{
                phone: 18676361342,
                password: "000000"
            })
            console.log(res)
            if(res.code === 200) 
                this.vm.$message({
                    message: res.message,
                    type: 'success'
                })
            else
                this.vm.$message.error(res.message)
        } catch (error) {
            this.vm.$message.error('server 奔溃')
        }
    }

    //改密
    async updateUserPssw() {
        try {
            let res = await this.post(`/api/update/user/pssw`,{
                phone: 18676361342,
                password: "000000"
            })
            console.log(res)
            if(res.code === 200) 
                this.vm.$message({
                    message: res.message,
                    type: 'success'
                })
            else
                this.vm.$message.error(res.message)
        } catch (error) {
            this.vm.$message.error('server 奔溃')
        }
    }

    //更换手机号
    async updateUserPhone() {
        try {
            let res = await this.post(`/api/update/user/phone`,{
                uid: 1559405054382,
                phone: 18676361342
            })
            console.log(res)
            if(res.code === 200) 
                this.vm.$message({
                    message: res.message,
                    type: 'success'
                })
            else
                this.vm.$message.error(res.message)
        } catch (error) {
            this.vm.$message.error('server 奔溃')
        }
    }

    //新增标签
    async postTags() {
        try {
            let res = await this.post(`/api/post/tags`,{
                name: "Koa",
                color: "#2C93C5",
                description: "Koa是一个轻量级的Web应用框架。"
            })
            console.log(res)
            if(res.code === 200) 
                this.vm.$message({
                    message: res.message,
                    type: 'success'
                })
            else
                this.vm.$message.error(res.message)
        } catch (error) {
            this.vm.$message.error('server 奔溃')
        }
    }

    //新增文章
    async postArticle() {
        try {
            let res = await this.post(`/api/post/article`,{
                title: "第一篇文章的标题 title",
                description: "第一篇文章的描述 description",
                context: "第一篇文章的内容 context",
                picture: "第一篇文章的缩略图 picture",
                tags: [{ name: 'react', color: "#333" }]
            })
            console.log(res)
            if(res.code === 200) 
                this.vm.$message({
                    message: res.message,
                    type: 'success'
                })
            else
                this.vm.$message.error(res.message)
        } catch (error) {
            this.vm.$message.error('server 奔溃')
        }
    }

    //获取所有文章
    async AllArticle() {
        try {
            let res = await this.get('/api/all/article')
            console.log(res)
            if(res.code === 200) 
                this.vm.$message({
                    message: res.message,
                    type: 'success'
                })
            else
                this.vm.$message.error(res.message)
        } catch (error) {
            this.vm.$message.error('server 奔溃')
        }
    }

}



