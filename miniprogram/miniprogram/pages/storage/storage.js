const app = getApp();
Page({
  data:{
    length:0,
    words:[],
    judge:false
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that=this
  wx.cloud.init()
  const db=wx.cloud.database()
    let x = this.data.length
    let old_data = this.data.words
    db.collection("words").orderBy("year",'desc').skip(x) 
      .get()
      .then(res => { 

        this.setData({
          words: old_data.concat(res.data),
          length: x+res.data.length
        })
      }) 
   setTimeout(
      function(){
        if(x!=that.data.length)
      {
        wx.showLoading({
          title: '读取更多数据…',
          duration: 1000
        })
      }
      else{
        wx.showToast({
          title: '暂无更多数据',
          duration: 1000,
          icon:"none"
        })
      }
    },500)
  },
  //单词库的展示
onShow(){
  var that=this
  wx.cloud.init()
  const db=wx.cloud.database()
  db.collection("words").where({_openid:app.globalData.openid}).get().then(res=>{
  this.setData({length:res.data.length,
              words:res.data})
              console.log(res.data)
  })
  //延时判断库中是否有单词
setTimeout(function(){
  if(that.data.length==0)
  {
    wx.showModal({
      title: '提示',
      content: '请先上传数据',
      success(){
      wx.navigateBack({
        delta: 1,
      })
      }
    })
  }
},500)
},
//调用云函数删除数据库
delete(){
  wx.cloud.init()
  const db=wx.cloud.database()
  wx.showModal({
    title: '警告！',
    content: '确定删除单词库吗？\n 该操作不可逆！',
    success: function (res) {
      if (res.confirm) {
        wx.cloud.callFunction({
          name: 'remove',
          data: {
            opid:app.globalData.openid
          },
          success: res => {
            console.log("已删除！")
            wx.showToast({
              title: "已删除！",
              duration:1500
            })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      } else {
    }
  }
})
}
})