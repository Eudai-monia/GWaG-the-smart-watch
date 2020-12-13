#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiServer.h>

//引入u8glib库
#include "U8glib.h"
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);

//引入ESP8266.h
#include "ESP8266.h"
#include "SoftwareSerial.h"

//配置ESP8266WIFI设置
#define SSID "Eudaimonia"    //填写2.4GHz的WIFI名称，不要使用校园网
#define PASSWORD "********"//填写自己的WIFI密码
#define HOST_NAME "api.heclouds.com"  //API主机名称，连接到OneNET平台，无需修改
#define DEVICE_ID "********"       //填写自己的OneNet设备ID
#define HOST_PORT (80)                //API端口，连接到OneNET平台，无需修改
String APIKey = "************"; //与设备绑定的APIKey

int i=0;
int j=0;
char *p=NULL;
int k=0;//定义单词个数
char words[10][10] ={};//存放单词的数组

//定义绘制函数
void draw(char *temp_str) {
  u8g.setFont(u8g_font_unifont);
  u8g.drawStr(30 , 30, temp_str);
}
void draw1(char *temp_str) {
  u8g.setFont(u8g_font_unifont);
  u8g.drawStr(35 , 15, temp_str);
}
void draw2(char *temp_str) {
  u8g.setFont(u8g_font_unifont);
  u8g.drawStr(35 , 25, temp_str);
}
void draw3(char *temp_str) {
  u8g.setFont(u8g_font_unifont);
  u8g.drawStr(35 , 35, temp_str);
}
void draw4(char *temp_str) {
  u8g.setFont(u8g_font_unifont);
  u8g.drawStr(35 , 45, temp_str);
}
void draw5(char *temp_str) {
  u8g.setFont(u8g_font_unifont);
  u8g.drawStr(35 , 55, temp_str);
}
void drawpg(char *temp_str) {
  u8g.setFont(u8g_font_unifont);
  u8g.drawStr(60 , 65, temp_str);
}


SoftwareSerial mySerial(3, 2);
ESP8266 wifi(mySerial);

void setup()
{
  pinMode(8,INPUT); //左按键接引脚8，按下时为低电平
  pinMode(9,INPUT); //右按键接引脚9，按下时为低电平
  pinMode(10,INPUT); //reset按键接引脚10，按下时为低电平
  mySerial.begin(115200); //初始化软串口
  Serial.begin(9600);     //初始化串口
  Serial.print(F("setup begin\r\n"));

  //以下为ESP8266初始化的代码
  Serial.print(F("FW Version: "));
  Serial.println(wifi.getVersion().c_str());

  if (wifi.setOprToStation()) {
    Serial.print(F("to station ok\r\n"));
  } else {
    Serial.print(F("to station err\r\n"));
  }

  //ESP8266接入WIFI
  if (wifi.joinAP(SSID, PASSWORD)) {
    Serial.print(F("Join AP success\r\n"));
    Serial.print(F("IP: "));
    Serial.println(wifi.getLocalIP().c_str());
  } else {
    Serial.print(F("Join AP failure\r\n"));
  }
  mySerial.println(F("AT+UART_CUR=9600,8,1,0,0"));
  mySerial.begin(9600);
  Serial.println(F("setup end\r\n")); 
//OLED绘制初始化
   if ( u8g.getMode() == U8G_MODE_R3G3B2 ) 
  {
      u8g.setColorIndex(255);     // white
    }
    else if ( u8g.getMode() == U8G_MODE_GRAY2BIT ) 
    {
      u8g.setColorIndex(3);         // max intensity
    }
    else if ( u8g.getMode() == U8G_MODE_BW ) 
    {
      u8g.setColorIndex(1);         // pixel on
    }
    else if ( u8g.getMode() == U8G_MODE_HICOLOR ) 
    {
      u8g.setHiColorByRGB(255,255,255);
    }
}
int timeout=1000;
int buffer_size=5500;

void loop(){
//按下reset按钮发送GET请求
  if(digitalRead(10) == LOW)
{
  if (wifi.createTCP(HOST_NAME, HOST_PORT)) { //建立TCP连接，如果失败，不能发送该数据
  Serial.print(F("create tcp ok\r\n"));
  char buffer1 [500];
      i=0;
//发送GET请求
  String postString="GET /devices/";
      postString+=DEVICE_ID;
      postString+="/datapoints?datastream_id=words HTTP/1.1";
      postString+="\r\n";
      postString+="Host:api.heclouds.com";
      postString+="\r\n";
      postString+="api-key: ";
      postString+=APIKey;
      postString+="\r\n";
      postString+="\r\n";
char *postArray = postString.c_str(); //将str转化为char数组
      wifi.send((const uint8_t *)postArray, strlen(postArray)); //send发送命令，参数必须是这两种格式，尤其是(const uint8_t*)
      Serial.println(F("send success"));
      wifi.recv((const uint8_t *)buffer1,(uint32_t)buffer_size, (uint32_t)timeout);
      String temp=(String)buffer1;
      //提取数据中的单词并存入数组
         for(int i=0;i<400;i++)
       {
          if(buffer1[i]=='!')
          {
            p=&buffer1[i+1];
            int num=(int)*p-48;
            k=0;
            while(num!=0)
            {
              for(j=0;j<num;j++)
              {
                p++;
                words[k][j]=*p;
              }
              words[k][j]='\0';
              p++;
              num=*p-48;
              Serial.print(words[k]);
              k++;
            }
            Serial.print("<---");
            Serial.print(k);
            Serial.println("----->");
            break;
          }
       }
       if (wifi.releaseTCP()) { //释放TCP连接
        Serial.print(F("release tcp ok\r\n"));
      } else {
        Serial.print(F("release tcp err\r\n"));
      }

    } else {
      Serial.print(F("create tcp err\r\n"));
    }
    Serial.println(k);
       while(digitalRead(10) == LOW);
}
//定义上翻页按钮
else if (digitalRead(8) == HIGH&&(i>0))
{
  i=i-1;
  while(digitalRead(8) == HIGH);
}
//定义下翻页按钮
else if (digitalRead(9) == HIGH&&(i<k))
{
  i=i+1;
  while(digitalRead(9) == HIGH);
}
//最后一页的图形绘制
if(i==k)
{
  u8g.firstPage();
       do {
            draw1("This");
            draw2("is");
            draw3("the");
            draw4("last");
            draw5("word!");
         } while( u8g.nextPage() );
}
//单词显示
else
{
       u8g.firstPage();
       do {
            draw(words[i]);
         } while( u8g.nextPage() );
         u8g.firstPage();

}
}
