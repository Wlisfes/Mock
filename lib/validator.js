const objectValidator = require('easy-object-validator');
const MD5 = require('md5')

/**
 * 请求参数校验
 * @param {Object} options 校验规则
 * @param {Object} [isResult] 校验失败时，将合并到ctx
 * @returns {Function} Koa中间件
 */
function validator(options, isResult) {
    return async (ctx, next) => {
        options = options || {};
        const target = ctx.request;
        const isValid = objectValidator(target, options);
        if (isValid) {
            await next();
        } else {
            ctx.body = isResult
        }
    }
}


/**
 * 暴露方法
 */

// 继承，用于自定义校验方法
validator.extend = (options) => {
    // 执行 objectValidator 的继承方法
    objectValidator.extend(options);

    Object.keys(options).forEach(name => {
        // 添加引用
        validator[name] = objectValidator[name];
    });
}
// 添加引用
validator.string = objectValidator.string;
validator.number = objectValidator.number;
validator.object = objectValidator.object;
validator.array = objectValidator.array;
validator.boolean = objectValidator.boolean;
validator.isRequire = objectValidator.isRequire;
validator.test = objectValidator.test;
validator.is = objectValidator.is;
validator.equals = objectValidator.equals;
validator.not = objectValidator.not;
validator.arrayOf = objectValidator.arrayOf;
validator.oneOf = objectValidator.oneOf;
validator.enums = objectValidator.enums;
validator.reset = objectValidator.reset;


//router参数验证
validator.isPrams = ({ key, method, code, Reply }) => {
    return async (ctx, next) => {
        let v;
        if(method === "POST") { v = ctx.request.body }
        else if(method === "GET") { v = ctx.query }
        else { Reply(ctx, { code: code.REEOR, message: "method is error" }); return }
        
        for(let k in key) {
            const isValid = objectValidator(
                { k: v[k] },
                { k: key[k].rule }
            )
            if(!isValid) { Reply(ctx, { code: code.LACK_ID, message: key[k].message }); return }
        }
        await next()
    }
}


//is对象数组
validator.isArr = ({ key, child, method, code, Reply }) => {
    return async (ctx, next) => {
        let k;
        if(method === "POST") { k = ctx.request.body[key.keys] }
        else if(method === "GET") { k = ctx.query[key.keys] }
        else { Reply(ctx, { code: code.REEOR, message: "method is error" }); return }

        if(objectValidator({ k }, { k: key.rule }) && k.length > 0 && k.every(el => typeof el === 'object')) {
            for (let v in k) {
                for(let n in child) {
                    if(!objectValidator({ n: k[v][n] }, { n: child[n].rule })) {
                        Reply(ctx, { code: code.LACK_ID, message: child[n].message }); return
                    }
                }
            }
            await next()
        }
        else {
            Reply(ctx, { code: code.LACK_ID, message: key.message }); return
        }
    }
}


//验证登录
validator.isToken = ({ code ,Reply }) => {
    return async (ctx, next) => {
        if(validator.getStore(ctx, code.TOKEN))
            await next()
        else
            Reply(ctx, { code: code.NODLOG, message: "未登录！" })
    }
}


//验证权限
validator.isAdmin = ({ code ,Reply }) => {
    return async(ctx, next) => {
        let store = validator.getStore(ctx, code.TOKEN)
        if(store && store.admin === 'admin' || ctx.request.body.phone === 18676361342)
            await next()
        else
            Reply(ctx, { code: code.NOSTARE, message: "权限不足！" })
    }
}


//MD5转换
validator.MD5 = data => MD5(data)


//登录
validator.setStore = (ctx, key, props) => {
    if(!key) return
    ctx.session[key] = props
}

//获取
validator.getStore = (ctx, key) => {
    if(!key) return
    return ctx.session[key]
}

//登出
validator.removeStore = (ctx, key) => {
    if(!key) return
    ctx.session[key] = null
}






module.exports = validator;
