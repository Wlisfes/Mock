/*
 * @Date: 2019-05-29 15:08:34
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-06-13 11:42:12
 * @Description: 配置文件
 */

//数据库配置
export const SQLCOFN = {
    DATABASE: "mocks",                   //数据库名称
    DATABASE_NAME: "mocks",              //数据库连接名称
    DATABASE_PASSWORD: "77243",          //数据库连接密码
    HOST: "111.231.222.196",             //数据库地址
    DIALECT: "mysql",                    //数据库类型
    POOL: {                              //连接池配置
        max: 5,                          //最大连接数
        min: 0,                          //最小连接数
        idle: 10000
    },
    LOGGING: false,                      //关闭日志
}


//session配置
export const Token = {
    key: 'TOKEN',
    maxAge: (24 * 60 * 60000),
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
}


//状态码配置
export const code = {
    SUCCESS: 200,        //服务器成功返回请求的数据,
    LACK_ID: 201,        //参数缺失
    FAIL: 202,           //数据库查询为空 或已被占用
    NODLOG: 403,         //未登录
    NOSTARE: 402,        //权限不足
    REEOR: 500,          //服务器发生错误，请检查服务器。



    //登录状态key
    TOKEN: "MOCK_SERVER_TOKEN"
}