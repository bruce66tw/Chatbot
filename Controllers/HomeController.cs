using System;
using System.Linq;
using System.Web.Mvc;
using Chatbot.Services;
using Base.Services;
using Chatbot.Models;

namespace Chatbot.Controllers
{
    public class HomeController : Controller
    {
        const string Cmd = "cmd:";
        private int CmdLen = Cmd.Length;

        private UserModel _user = null;

        public ActionResult Index()
        {
            //reply hello file if any
            var msg = _Config.GetStr("FirstReplyFile");
            var sys = _Xp.FullList
                .Where(a => a.FindStr == msg)
                .FirstOrDefault();
            var reply = (sys == null)
                ? ""
                : ReadReplyFile(0, sys.RealName) ?? "";
            ViewBag.FirstMsg = (reply == "")
                ? ""
                : GetReply("", reply);
            return View();
        }

        //send question
        //cmd: for command 
        public string Send(string msg)
        {
            //adjust
            var newMsg = msg.Replace(" ", "").Replace(",", "").Replace("?", "");

            //get user ip & set User if need
            //string ip = Request.UserHostAddress;
            if (newMsg.Length > CmdLen && newMsg.Substring(0, CmdLen) == Cmd)
                return GetReply(msg, RunCmd(newMsg.Substring(4)));

            //check full search
            //get system, find first match
            var sys = _Xp.FullList
                .Where(a => a.FindStr == newMsg)
                .FirstOrDefault();
            if (sys != null)
            {
                var reply = ReadReplyFile(sys.SysNo, sys.RealName);
                if (reply == null)
                    reply = _Xp.NotFoundMsg;
                else
                {
                    UpdateProfile(new UserModel()
                    {
                        SysName = sys.RealName,
                        MidName = "",
                    });
                }
                return GetReply(msg, reply);
            }

            //find system data
            sys = _Xp.SysList
                .Where(a => newMsg.IndexOf(a.FindStr) >= 0)
                .FirstOrDefault();
            if (sys == null)
            {
                FindUser();
                if (string.IsNullOrEmpty(_user.SysName))
                {
                    _user.SysNo = 0;
                    _user.SysName = _Xp.SysNames[0];
                }
                sys = new SystemModel()
                {
                    SysNo = _user.SysNo,
                    RealName = _user.SysName,
                };
            }
            else
            {
                newMsg = newMsg.Replace(sys.FindStr, "");
            }

            //get type, find first match
            var typeName = "";
            var type = _Xp.TypeList
                .Where(a => newMsg.IndexOf(a.FindStr) >= 0)
                .FirstOrDefault();
            if (type == null)
                typeName = "what";    //default type
            else
            {
                typeName = type.RealName;
                newMsg = newMsg.Replace(type.FindStr, "");
            }

            //get mid data, find first match
            var midNames = _Xp.TopicList[sys.SysNo]
                .Where(a => newMsg.IndexOf(a.FindStr) >= 0)
                .Select(a => a.RealName)
                .Distinct()
                .ToList();

            //case of no mid data
            if (midNames.Count == 0)
                return GetReply(msg, ReadReplyFile(sys.SysNo, sys.RealName + "_" + typeName) ?? _Xp.NotFoundMsg);

            //find first existed file
            foreach (var midName in midNames)
            {
                var reply = ReadReplyFile(sys.SysNo, midName + "_" + typeName);
                if (reply != null)
                    return GetReply(msg, reply);
            }

            //not found
            return GetReply(msg, _Xp.NotFoundMsg);
        }

        //find user profile
        private void FindUser()
        {
            if (_user == null)
            {
                _user = _Xp.Users
                    .Where(a => a.Ip == Request.UserHostAddress)
                    .FirstOrDefault();
                if (_user == null)
                {
                    _user = new UserModel() {
                        Ip = Request.UserHostAddress
                    };
                    _Xp.Users.Add(_user);
                }
            }
        }

        private string GetUserSysName()
        {
            FindUser();
            return _user.SysName;
        }

        //update user profile
        private void UpdateProfile(UserModel user)
        {
            FindUser();
            _user.SysName = user.SysName;
            _user.MidName = user.MidName;
        }

        //run command
        //return reply msg
        private string RunCmd(string cmd)
        {
            switch(cmd)
            {
                case "init":
                    _Xp.Init();
                    return "init Ok.";
                case "check":
                    //check repeat count
                    var count = _Xp.TopicList
                        .SelectMany(a => a)
                        .GroupBy(a => a.FindStr)
                        .Count(a => a.Count() > 1);
                    return "found " + count + " repeats.";
                case "checkToLog":
                    //generate check result log 
                    var rows = _Xp.TopicList
                        .SelectMany(a => a)
                        .GroupBy(a => a.FindStr)
                        .Where(a => a.Count() > 1)
                        .Select(a => string.Format("FindStr={0}, RealNames={1}", a.Key, _List.ToStr(a.Select(b => b.RealName).ToList())))
                        .ToList();
                    _Log.Info("checkToLog:\n" + _List.ToStr(rows, "\n"));
                    return "checkToLog Ok.";
                default:
                    return "command not found";
            }
        }

        //read reply file to text
        private string ReadReplyFile(int sysNo, string fileName)
        {
            var filePath = _Xp.DataPath + _Xp.SysNames[sysNo] + "\\_reply\\" + fileName + ".txt";
            return _File.ToStr(filePath);
        }

        //get reply text
        private string GetReply(string input, string reply)
        {

            var text = @"
<div class='xu-robot-msg'>
    <div>
        <p>{2}</p>
        <span class='xu-dt'>{1}</span>
    </div>
</div>
";
            if (input != "")
                text = @"
<div class='xu-my-msg'>
    <div>
        <p>{0}</p>
        <span class='xu-dt'>{1}</span>
    </div>
</div>
" + text;

            return string.Format(text, input, 
                DateTime.Now.ToString("HH:mm"), 
                reply.Replace("<a>", "<a href='#' onclick='_me.onClickMsg(this)'>"));
        }

    }//class
}