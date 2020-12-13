// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
const db=cloud.database()
exports.main = async (event, context) => {
  return db.collection("123").where({tag:event.tag}).count()
}