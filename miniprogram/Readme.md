#GWaG智能英语学习手表小程序端
---
##小程序功能：
###1.手动上传单词至onenet平台及云数据库
* 未按照输入框顺序输入单词后的单词列表整合
* 单词列表转换至arduino可读数据的传输数据改写
* 云数据库中单词数据附带上传时间信息
###2.口语评测
* 按钮随机显示单词库中5个不重复数据
* 口语评测，句子评测
* 评分的平均分计算及缓存
* 单词、句子的标准读音播放
###3.账户登录及打卡
* 每日一次的打卡功能
* 账号单词库的查看及删除
* ~~*两位帅哥的联系方式*~~

##使用方法：
解压本文件，在微信开发工具中选择导入项目，导入本小程序
##**CAUTION!**
* 使用时，将assessment.js中的secretid,secretkey改为你的secretId,secretKey
```
const secretid=""//这里改为你的secretId
```
```
const secretkey=""//这里改为你的secretKey
```
* 使用时，将home.js中的deviceid,apikey改为你的deviceId,api-key
```
const deviceid=""//填入你的onenet设备id
```
```
const apikey=""//填入你的设备api-key
```