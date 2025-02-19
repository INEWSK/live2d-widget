// 注意：live2d_path 参数应使用绝对路径
const live2d_path = "https://cdn.jsdelivr.net/gh/INEWSK/live2d-widget@0.9.0/";
// const live2d_path = "/live2d-widget/";

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;

    if (type === "css") {
      tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.href = url;
    } else if (type === "js") {
      tag = document.createElement("script");
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

// loading waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 768) {
  Promise.all([
    loadExternalResource(live2d_path + "waifu.css", "css"),
    loadExternalResource(live2d_path + "live2d.min.js", "js"),
    loadExternalResource(live2d_path + "waifu-tips.js", "js"),
  ]).then(() => {
    initWidget({
      waifuPath: live2d_path + "waifu-tips.json",
      // apiPath: "https://live2d.fghrsh.net/api/",
      cdnPath: "https://live2d-api-inewsk.vercel.app/",
      // cdnPath: "http://127.0.0.1:5500/", // local server
    });
  });
}
// initWidget 第一个参数为 waifu-tips.json 的路径，第二个参数为 API 地址
// API 后端可自行搭建，参考 https://github.com/fghrsh/live2d_api
// 初始化看板娘会自动加载指定目录下的 waifu-tips.json

console.log(
  "%c Live2D Widget %c  https://github.com/stevenjoezhang/live2d-widget ",
  "margin: 1em 0; padding: 5px 10px; background: #f26763; color: #fff",
  "margin: 1em 0; padding: 5px 0px; background: #fff;"
);
