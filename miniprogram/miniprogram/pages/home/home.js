const app = getApp();
const deviceid="645410468"//填入你的onenet设备id
const apikey="fR56yvk8HPU=RqcjeHXgG13Hw5s="//填入你的设备api-key
Page({
  
  data:
  {
    length:0,
    Year:1800,
    Month:1,
    Day:1,
    words:[],
    up:[],
    num:0,
    judge:false,
    input:"",
  },
  onLoad()
  {
    //获取当前日期
    var myDate = new Date();
    this.data.Year=myDate.getFullYear()
    this.data. Month=myDate.getMonth()+1
    this.data.Day=myDate.getDate()
  },
  bindsub(e){
    
    var that=this
    var num=0,temp=0
    //将输入存入数组
    this.setData({'words[0]':e.detail.value.one})
    this.setData({'words[1]':e.detail.value.two})
    this.setData({'words[2]':e.detail.value.three})
    this.setData({'words[3]':e.detail.value.four})
    this.setData({'words[4]':e.detail.value.five})
    this.setData({'words[5]':e.detail.value.six})
    this.setData({'words[6]':e.detail.value.seven})
    this.setData({'words[7]':e.detail.value.eight})
    this.setData({'words[8]':e.detail.value.nine})
    this.setData({'words[9]':e.detail.value.ten})
   //上传非空单词
    for(temp=0;temp<10;temp++)
    {
     if(that.data.words[temp]!="")
     { 
        num++
        if(num==1)
          that.setData({'up[0]':that.data.words[temp]})
        else if(num==2)
          that.setData({'up[1]':that.data.words[temp]})
        else if(num==3)
          that.setData({'up[2]':that.data.words[temp]})
        else if(num==4)
          that.setData({'up[3]':that.data.words[temp]})
        else if(num==5)
          that.setData({'up[4]':that.data.words[temp]})
        else  if(num==6)
          that.setData({'up[5]':that.data.words[temp]})
        else  if(num==7)
          that.setData({'up[6]':that.data.words[temp]})
        else  if(num==8)
          that.setData({'up[7]':that.data.words[temp]})
         else if(num==9)
          that.setData({'up[8]':that.data.words[temp]})
        else  if(num==10)
          that.setData({'up[9]':that.data.words[temp]})
     }
  }
  this.setData({num:num})
  //上传单词至云数据库
  wx.showLoading({
    title: '上传至数据库',
  })
    wx.cloud.init({})
    const db=wx.cloud.database()
     for(temp=0;temp<num;temp++)
    {
      db.collection("words").add({
        data:{
          word:that.data.up[temp],
          year:that.data.Year,
          month:that.data.Month,
          day:that.data.Day
        },
        success(){
         
        }
      })
    }
    //将单词上传至onenet
    wx.showLoading({
      title: '上传至Arduino',
    })
    var string=""
    for(temp=0;temp<num;temp++)
    {
      that.data.length=that.data.up[temp].length
      string+=that.data.length+that.data.up[temp]
    }
    string+=0
    wx.request({
      url:`https://api.heclouds.com/devices/${deviceid}/datapoints`,
      method: 'POST',
      header:
      {
        'api-key':`${apikey}`
      },
      data:{
        'datastreams':[{
          "id":`words`,
          "datapoints":[{
            "value":'!'+string
          }]
        }]
      },
       success(res){
         console.log(res)
         that.setData({judge:true})
        }
    })
  //上传结果显示
    setTimeout(
      function(){
        if(that.data.judge==true)
        {
        wx.showToast({
          title:"上传成功!",
          duration:1000,
        })
        that.setData({
            input:""
        })
      }
      else
      {
        wx.showToast({
          title:"Oops!上传失败,请重试或联系管理员!",
          duration:2000,
          icon:"none"
        })
      }
    },2500)
    
    
    
  },
  
  })


