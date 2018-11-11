# Chatbot

使用ASP.NET開發聊天機器人

## 介紹

聊天機器人是最近十分熱門的軟體系統, 許多科技大廠都有提供這樣的引擎, 只要透過簡單的設定, 就可以建立自己的聊天機器人, 由於困難度不高, 在這裡我們選擇自行開發, 使用的工具為 ASP.NET MVC 5, Bootstrap 4, jQuery, Visual Studio 2017 Community

### 設計原理

使用者每次提出的問題會被拆解成3個部分, 第一是系統種類, 第二是主題, 第三是問題種類, 例如使用者的問題為: 如何建立聊天機器人? 則系統種類為聊天機器人(chatbot), 主題為 "建立", 問題種類為 "如何"(how), 接下來系統就會讀取chatbot\_reply目錄底下的 "建立_how.txt" 這個檔案的內容, 然後顯示在聊天畫面。聊天機器人可以處理的主題清單存放在chatbot目錄下的文字檔, 每個文字檔的內容記錄這個主題的類似名稱, 例如: 建立.txt的內容為: 創立、創建、建造。

### 安裝

聊天機器人是一個 web 系統, 裡面包含2個 project, 第一個是 [Base](https://github.com/bruce66tw/Base), 內容為公用的程式, 另一個為 [Chatbot](https://github.com/bruce66tw/Chatbot), 內容為聊天機器人的主要程式, 從 GitHub 分別下載這2個專案到相同目錄底下後(例如: d:\\_project目錄), 在 Visual Studio 開啟 Chatbot.sln, 並且加入參考 Base project, 重新編譯即可。 

### 操作畫面

![聊天畫面](https://github.com/bruce66tw/Chatbot/blob/master/images/chat.png)
如上圖, 進入系統後, 聊天畫面位於螢幕右下方, 同時立即顯示一則歡迎的訊息, 使用者在下方的文字框輸入問題後按下Enter, 這時畫面上會多出2則訊息: 一是灰色的使用者問題, 另一個則為綠色的系統回覆訊息。另外, 你可以從聊天畫面輸入以下3個控制指令:
1.cmd:init : 重新對系統做初始化, 如果你修改系統的回覆資料, 這個指令可以重新載入這些資料。
2.cmd:check : 檢查是否有重覆的主題資料。
3.cmd:checkToLog : 把重覆的資料寫入 log 檔案, 檔案位於 Chatbot 專案所在的 log 目錄, 檔名為今天日期加上 -info.txt, 例如 2018-11-09-info.txt

### 資料維護

聊天機器人所能夠回答的問題取決於你所設定的資料, 資料愈多, 則可以回答的問題愈多, 在 web.config 的 DataPath 路徑下, 目前有2個目錄, 第一個是 _type, 它用來存放問題的種類, 目前有 how.txt、what.txt、when.txt...; 另一個目錄為 chatbot, 它的內容是聊天機器人目前可以回答的所有問題, chatbot 目錄底下的文字檔即為前面所說的主題; _full 目錄的內容為完整比對的問題, _reply 目錄則為問題的回覆內容。

### 答覆的資料種類

如上圖, 總共有3種類型, 第一種是純文字, 第二種是連結, 使用者點選之後, 系統會利用這個文字重新發出一個問題, 第三種是網頁, 你可以針對需要詳細解說的問題提供網頁內容的回覆, 只要在檔案名稱後面加個2, 系統會自動載入這個網頁, 例如:

### 程式原理

系統啟動時, 會執行_Xp.Init(), 載入 DataPath 路徑下的資料, 使用者提出問題時, 系統先做完整的問題內容比對, 如果找不到對應的回覆檔案, 則將問題折解為3個部分, 再尋找回覆內容。

### Style設定

聊天畫面的 style 記錄在 Chatbot project 的 Content/view/index.css, 為了與其他系統的style做區隔, class name 加上前綴字串 -xu

## 作者

* **Bruce Chen** - *Initial work*

## 版權

MIT License
