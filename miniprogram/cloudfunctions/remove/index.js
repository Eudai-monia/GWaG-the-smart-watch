
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database()
exports.main = async (event, context) => {
  console.log(event.opid)
  db.collection("words").where({_openid:event.openid}).remove()
}