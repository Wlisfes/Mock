/*
 * @Date: 2019-05-29 15:08:34
 * @Author: 情雨随风
 * @LastEditors: 情雨随风
 * @LastEditTime: 2019-05-31 16:11:03
 * @Description: 配置文件
 */


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


export const code = {
    SUCCESS: 200,        //服务器成功返回请求的数据,
    LACK_ID: 201,        //参数缺失
    FAIL: 202,           //数据库查询为空 或已被占用
    REEOR: 500,          //服务器发生错误，请检查服务器。
}