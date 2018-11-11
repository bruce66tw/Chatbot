using Base.Services;
using Chatbot.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Chatbot.Services
{
    public static class _Xp
    {
        //get from web.config
        public static string DataPath;
        public static string NotFoundMsg;

        //user profile
        public static List<UserModel> Users = null;

        //system names, mapping to data sub folder
        public static List<string> SysNames = null;

        //full search
        public static List<SystemModel> FullList = null;

        //level 1: system
        public static List<SystemModel> SysList = null;

        //level 2: topic
        public static List<List<FileModel>> TopicList = null;

        //level 3: type(5W+1H)
        public static List<FileModel> TypeList = null;

        //initial
        public static void Init()
        {
            //get path
            var dataPath = _Config.GetStr("DataPath");
            if (string.IsNullOrEmpty(dataPath))
                return;

            var notFound = _Config.GetStr("NotFoundMsg");
            if (string.IsNullOrEmpty(notFound))
                notFound = "Not Found";

            DataPath = _Str.AddAntiSlash(dataPath);
            NotFoundMsg = notFound.Replace("(", "<").Replace(")", ">");

            //declare
            Users = new List<UserModel>();
            SysNames = new List<string>();
            FullList = new List<SystemModel>();
            SysList = new List<SystemModel>();
            TopicList = new List<List<FileModel>>();
            TypeList = new List<FileModel>();

            //read type(5W+1H)
            var dir2 = _Str.AddAntiSlash(dataPath);
            var files = Directory.GetFiles(dir2 + "_type\\", "*.txt");
            foreach (var file in files)
                ReadFileData(file, ref TypeList, false);

            //each dir
            //read full search, system & topic
            var dirs = Directory.GetDirectories(dataPath).ToList();
            for (var i=0; i<dirs.Count; i++)
            {
                //skip underline folder
                var dir = dirs[i];
                var dirName = new DirectoryInfo(dir).Name;
                if (dirName.Substring(0, 1) == "_")
                    continue;

                SysNames.Add(dirName);

                //read full search
                files = Directory.GetFiles(_Str.AddAntiSlash(dir) + "_full\\", "*.txt");
                foreach (var file in files)
                    ReadSystemData(file, i, ref FullList, true);

                //read system
                var dirFile = dir + ".txt";
                if (File.Exists(dirFile))
                    ReadSystemData(dirFile, i, ref SysList, false);

                //read topic
                var list = new List<FileModel>();
                files = Directory.GetFiles(dir, "*.txt");
                foreach (var file in files)
                    ReadFileData(file, ref list, true);
                TopicList.Add(list);
            }
        }

        //system info into data
        private static void ReadSystemData(string filePath, int sysNo, ref List<SystemModel> data, bool addFileName)
        {
            var realName = Path.GetFileNameWithoutExtension(filePath);
            if (addFileName)
            {
                data.Add(new SystemModel
                {
                    FindStr = realName,
                    RealName = realName,
                    SysNo = sysNo,
                });
            }

            string line;
            var stream = new StreamReader(filePath);
            while ((line = stream.ReadLine()) != null)
            {
                data.Add(new SystemModel
                {
                    FindStr = line,
                    RealName = realName,
                    SysNo = sysNo,
                });
            }
            stream.Close();
        }

        //read file into data
        private static void ReadFileData(string filePath, ref List<FileModel> data, bool addFileName)
        {
            //if (realName == "")
            var realName = Path.GetFileNameWithoutExtension(filePath);
            if (addFileName)
            {
                data.Add(new FileModel
                {
                    RealName = realName,
                    FindStr = realName,
                });
            }
            //if (underLine)
            //    realName = realName.Substring(1);
            string line;
            var stream = new StreamReader(filePath);
            while ((line = stream.ReadLine()) != null)
            {
                data.Add(new FileModel
                {
                    RealName = realName,
                    FindStr = line,
                    //Level = 0,
                });
            }
            stream.Close();
        }

    }//class
}