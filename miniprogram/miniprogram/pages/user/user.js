
const app = getApp();
Page({
  data: {
    user: {},
    avatarUrl: './user-unlogin.png',
    userNickname:"点击头像登录,一起愉快玩耍~",
    day:0,
    Year:1800,
    Month:1,
    Day:1,
    openid:"",
    cyear:1800,
    cmonth:1,
    cday:1,
    login:false
  },
  onLoad()
  {
   
    //获取当前日期
    var myDate = new Date();
    this.data.Year=myDate.getFullYear()
    this.data. Month=myDate.getMonth()+1
    this.data.Day=myDate.getDate()
  },
  onGetUserInfo: function(e) {
    var that=this
    //获取头像、用户昵称
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userNickname: e.detail.userInfo.nickName,
      })
      app.globalData.login=true
      this.setData({
        login:app.globalData.login
      })
    }
    //调用云函数获取openid
    wx.cloud.init()
    const db=wx.cloud.database()
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.setData({openid:res.result.openid})
        app.globalData.openid=res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
   
    //上传一个打卡数据
    db.collection("check").add({
      data:{
        year:1800,
        month:1,
        date:1,
        day:0
      }
    })
    //获取打卡天数
   
    db.collection("check").where({_openid:that.data.openid}).orderBy("day","desc").get().then(res => {
      that.setData({day:res.data[0].day,
        cyear:res.data[0].year,
        cmonth:res.data[0].month,
        cday:res.data[0].date})
    })
    
  },
  //打卡按钮设置
  check(){
    var that=this
    wx.cloud.init()
    const db=wx.cloud.database()
    if(!app.globalData.login)
    {
      wx.showToast({
        title:"请先登录~",
        icon:"none",
        duration:1500,
      })
    }
    else if(app.globalData.login)
    {
      if(that.data.cyear==that.data.Year&&that.data.cmonth==that.data.Month&&that.data.cday==that.data.Day)
      {
        wx.showToast({
          title:"您今天已经打过卡啦~",
          icon:"none",
          duration:1500,
        })
      }
      else{
        db.collection("check").add({
          data:{
            year:that.data.Year,
            month:that.data.Month,
            date:that.data.Day,
            day:that.data.day+1
          }
        })
        db.collection("check").where({_openid:that.data.openid}).orderBy("day","desc").get().then(res => {
          that.setData({
            cyear:res.data[0].year,
            cmonth:res.data[0].month,
            cday:res.data[0].date})
        })
        wx.showToast({
          title:"打卡成功！",
          duration:1500,
        })
      }
    }
  },
  //单词库按钮设置
  storage(){
    if(!app.globalData.login)
    {
      wx.showToast({
        title:"请先登录~",
        icon:"none",
        duration:1500,
      })
    }
    else
    {
      wx.navigateTo({
      url: '../storage/storage',
    })
  }
  },
  //联系按钮设置
  connect(){
    wx.showModal({
      title: '听说你要联系我们',
      content: '李其乐 QQ：1012442350\n钟哲 QQ：2890953746',
      success: function (res) {
      }
    })
  }
})