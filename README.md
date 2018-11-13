# Chatbot

Developing Chatbot system by ASP.NET

## Introuduction

Chatbot system is popular recently, lots IT companies have their own skill to help user to build it by simple steps. Due to its simplity, we decide to develope one by ourself, development tools are ASP.NET MVC 5, Bootstrap 4, jQuery, Visual Studio 2017 Community.

### Design

When user request question, system will split it into 3 parts, first is system type, the second is topic, the third is question type. For example, user sends a question of "How to Build Chatbot system ?". These three parts will be: Chatbot、Build、How. Then system will read file of build_how.txt under folder  chatbot\_reply and echo to browser.

### Installation

Chatbot is a web system, it includes two projects, first is [Base](https://github.com/bruce66tw/Base), it contains public functional library codes. Another one is [Chatbot](https://github.com/bruce66tw/Chatbot), it's Chatbot main code. After you get them from GitHub and put in same folder.(such as d:\\_project folder), you can execute Visual Studio and open Chatbot.sln, then Base project into reference and compile Chatbot.sln. 

### Operation

![Chatbot form](https://github.com/bruce66tw/Chatbot/blob/master/images/chat_eng.png)
The chatbot form is at right-down of the screen, when you enter, it will show one welcome message. You can input your question in the text field at the bottom and press Enter key, then chatbot form will get two extra information, one is your question in gray color, another one is chatbot response message in green color. Additional, this chatbot also accept below three command:
1.cmd:init : re-initial system. After you modify any response message, you can execute the command for reload these message.
2.cmd:check : check chatbot whether has any duplicated topic.
3.cmd:checkToLog : write these duplicated topic into log file for you can check. Log file has file name of such as 2018-11-09-info.txt, and it is located at log folder of Chatbot project.

### Maintain Responsed Message

What chatbot could reply is depend on what you had input, for the path of web.config DataPath field, these should have two folder, one is _type, it stores question type, you can find them as how.txt、what.txt、when.txt..., another folder is chatbot, the text files under chatbot folder are all questions that use can ask. chatbot/_full folder is for full text compare for question. chatbot/_reply folder is for responsed message.

### Types of responsed message

There are three types of responsed message, first is pure text, the second is link, when user click the link, it sends another question. the third is html page, if your responsed text file has "2" at the end, system will show its content as html path automatically.

### Style 

The style file is at Content/view/index.css under chatbot project, for identify with other system, we add character of "-xu" at the beginning for class name.

## Authors

* **Bruce Chen** - *Initial work*

## License

MIT License
