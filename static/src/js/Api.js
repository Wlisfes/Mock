/*
 * @Author: 情雨随风
 * @Date: 2019-05-31 23:31:08
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-08-04 10:50:00
 * @Description: 
 */


axios.defaults.baseURL='http://localhost:9800/api'

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
            let res = await this.post(`/post/user`,{
                phone: 18676361342,
                password: "000000",
                nickname: "情雨随风",
                sex: 2,
                age: 18,
                admin: 'admin',
                description: "项目开发者, 超级管理员！",
                avatar: "/assets/album/598cc998f3e7b.png"
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
            let res = await this.post(`/login/user`,{
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

    //获取全部用户
    async AllUser() {
        try {
            let res = await this.get('/all/user')
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
            let res = await this.post(`/update/user/pssw`,{
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
            let res = await this.post(`/update/user/phone`,{
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
            let res = await this.post(`/post/tags`,{
                name: "React",
                color: "#2C93C5",
                description: "React是一个构建数据驱动的js库。"
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

    //修改标签
    async updateTags() {
        try {
            let res = await this.post(`/update/tags`,{
                id: 1559405521695,
                name: "Vue",
                description: `Vue是一个构建数据驱动的 web 界面的渐进式框架。Vue.js 的目标是通过尽可
                能简单的 API 实现响应的数据绑定和组合的视图组件。它不仅易于上手，还便于与第三方库或既有项目整合。`
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

    //获取全部标签
    async AllTags() {
        try {
            let res = await this.get('/all/tags')
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

    //获取已开放标签
    async AllOpenTags() {
        try {
            let res = await this.get('/all/open/tags')
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

    //获取已关闭标签
    async AllDownTags() {
        try {
            let res = await this.get('/all/down/tags')
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

    //获取已删除标签
    async AllDelTags() {
        try {
            let res = await this.get('/all/del/tags')
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
    
    //查找id标签
    async idTags() {
        try {
            let res = await this.get(`/id/tags`,{
                id: 1559405521695
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

    //开放标签
    async openTags() {
        try {
            let res = await this.get(`/open/tags`,{
                id: 1559405521695
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

    //关闭标签
    async downTags() {
        try {
            let res = await this.get(`/down/tags`,{
                id: 1559405521695
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

    //删除标签
    async delTags() {
        try {
            let res = await this.get(`/del/tags`,{
                id: 1559405521695
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
            let res = await this.post(`/post/article`,{
                title: "第一篇文章的标题 title",
                description: "第一篇文章的描述 description",
                context: "第一篇文章的内容 context",
                picture: "第一篇文章的缩略图 picture",
                tags: [
                    { name: 'Koa', color: '#2C93C5', id: "4f92d63cf5200add7a8416e907e248fc" }
                ]
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
            let res = await this.get('/all/article')
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

    //根据标签获取开放文章
    async AllTagsArticle() {
        try {
            let res = await this.get('/all/tags/article', {
                id: '283ae981f6c85abb02021056a870afe4'
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

    //获取已开放文章
    async AllOpenArticle() {
        try {
            let res = await this.get('/all/open/article')
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

    //获取已关闭文章
    async AllDownArticle() {
        try {
            let res = await this.get('/all/down/article')
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

    //获取已删除表
    async AllDelArticle() {
        try {
            let res = await this.get('/all/del/article')
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

    //开放文章
    async openArticle() {
        try {
            let res = await this.get(`/open/article`,{
                id: "eab345838723c0737a69276141a50613"
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

    //关闭文章
    async downArticle() {
        try {
            let res = await this.get(`/down/article`,{
                id: "eab345838723c0737a69276141a50613"
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

    //关闭文章
    async delArticle() {
        try {
            let res = await this.get(`/del/article`,{
                id: "eab345838723c0737a69276141a50613"
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

    //根据id查找文章
    async idArticle() {
        try {
            let res = await this.get(`/id/article`,{
                id: "eab345838723c0737a69276141a50613"
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

    //根据id点赞文章
    async sukiArticle() {
        try {
            let res = await this.get(`/suki/article`,{
                id: "eab345838723c0737a69276141a50613"
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

    //新增项目
    async postTaske() {
        try {0
            let res = await this.post(`/post/taske`, {
                name: "VueAdmin",
                description: "使用Vue、ant-design-vue构建的后台管理系统。",
                github: "https://github.com/Wlisfes/AntAdmin",
                viewUrl: "http://ant.lisfes.cn",
                weights: 3,
                tags: [
                    { name: 'React', color: '#333333', id: '6093972fd8f256630ecd52807ef1670b' },
                    { name: 'Vue', color: '#2C93C5', id: '6093972fd8f256630ecd52807ef1670b' },
                    { name: 'Koa', color: '#2C93C5', id: '6093972fd8f256630ecd52807ef1670b' }
                ]
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

    //获取所有项目
    async AllTaske() {
        try {
            let res = await this.get(`/all/taske`)
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



