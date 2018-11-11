using System.Web;
using System.Web.Optimization;

namespace Chatbot
{
    public class BundleConfig
    {
        // 如需「搭配」的詳細資訊，請瀏覽 http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //vendor css
            bundles.Add(new StyleBundle("~/css1").Include(
                "~/Content/bootstrap.css"));

            //vendor js
            bundles.Add(new ScriptBundle("~/js1").Include(
                "~/Scripts/jquery-3.3.1.min.js",
                "~/Scripts/popper.min.js",
                "~/Scripts/bootstrap.min.js")
                );

            //custom js(base whole folder)
            bundles.Add(new ScriptBundle("~/js2")
                .IncludeDirectory("~/Scripts/base", "*.js", false)
                );

            //bundles.Add(new Scripts(""));
            //bindling enable or not !!
#if DEBUG
            BundleTable.EnableOptimizations = false;
#else
            BundleTable.EnableOptimizations = true;
#endif

        }
    }
}
