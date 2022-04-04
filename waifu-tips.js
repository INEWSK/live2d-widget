/*
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

function loadWidget(config) {
  let { waifuPath, apiPath, cdnPath } = config;
  let useCDN = false,
    modelList;
  if (typeof cdnPath === "string") {
    useCDN = true;
    if (!cdnPath.endsWith("/")) cdnPath += "/";
  } else if (typeof apiPath === "string") {
    if (!apiPath.endsWith("/")) apiPath += "/";
  } else {
    console.error("Invalid initWidget argument!");
    return;
  }
  localStorage.removeItem("waifu-display");
  sessionStorage.removeItem("waifu-text");
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="640" height="640"></canvas>
			<div id="waifu-tool">
				<span class="fa fa-lg fa-home"></span>
        <span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-user-group"></span>
				<span class="fa fa-lg fa-shirt"></span>
        <span class="fa fa-lg fa-moon"></span>
				<span class="fa fa-lg fa-x"></span>
			</div>
		</div>`
  );
  // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
  setTimeout(() => {
    document.getElementById("waifu").style.bottom = 0;
  }, 0);

  function randomSelection(obj) {
    return Array.isArray(obj)
      ? obj[Math.floor(Math.random() * obj.length)]
      : obj;
  }
  // 检测用户活动状态，并在空闲时显示消息
  let userAction = false,
    userActionTimer,
    messageTimer,
    messageArray = [
      "拿小拳拳錘你胸口！",
      "我只是閉眼睛一下啦。",
      "你還記得自己喝過多少瓶藥水嘛？",
      "請別太勉強，盡力就好。",
      "沒問題的。",
    ];
  window.addEventListener("mousemove", () => (userAction = true));
  window.addEventListener("keydown", () => (userAction = true));
  setInterval(() => {
    if (userAction) {
      userAction = false;
      clearInterval(userActionTimer);
      userActionTimer = null;
    } else if (!userActionTimer) {
      userActionTimer = setInterval(() => {
        showMessage(randomSelection(messageArray), 6000, 9);
      }, 20000);
    }
  }, 1000);

  (function registerEventListener() {
    document
      .querySelector("#waifu-tool .fa-home")
      .addEventListener("click", () => {
        if (document.location.pathname != "/") {
          document.location.href = "/";
        }
      });
    document
      .querySelector("#waifu-tool .fa-comment")
      .addEventListener("click", showHitokoto);
    document
      .querySelector("#waifu-tool .fa-user-group")
      .addEventListener("click", loadOtherModel);
    document
      .querySelector("#waifu-tool .fa-shirt")
      .addEventListener("click", loadRandModel);
    document
      .querySelector("#waifu-tool .fa-moon")
      .addEventListener("click", () =>
        document.getElementById("update_style").click()
      );
    // document
    //   .querySelector("#waifu-tool .fa-info-circle")
    //   .addEventListener("click", () => {
    //     open("https://github.com/stevenjoezhang/live2d-widget");
    //   });
    document
      .querySelector("#waifu-tool .fa-x")
      .addEventListener("click", () => {
        localStorage.setItem("waifu-display", Date.now());
        showMessage("嗚 QWQ，再見～", 2500, 11);
        setTimeout(() => {
          document.getElementById("waifu").style.bottom = "-500px";
        }, 3000);
        setTimeout(() => {
          document.getElementById("waifu").style.display = "none";
          document
            .getElementById("waifu-toggle")
            .classList.add("waifu-toggle-active");
        }, 5000);
      });
    const devtools = () => {};
    console.log("%c", devtools);
    devtools.toString = () => {
      showMessage("想要偷看什麼小祕密嗎？", 6000, 9);
    };
    window.addEventListener("copy", () => {
      showMessage("記得標記來源喔～", 6000, 9);
    });
    window.addEventListener("visibilitychange", () => {
      messageArray = ["歡迎回來。", "嗨～♪"];
      if (!document.hidden) showMessage(randomSelection(messageArray), 6000, 9);
    });
  })();

  (function welcomeMessage() {
    let text;
    if (location.pathname === "/") {
      // 如果是主頁
      const now = new Date().getHours();
      if (now > 5 && now <= 7) text = "早上好！美好的一天就要開始了。";
      else if (now > 7 && now <= 11)
        text = "上午好！工作順利嘛，不要久坐，多起來走動走動哦！";
      else if (now > 11 && now <= 13) text = "中午了，現在是午餐時間！";
      else if (now > 13 && now <= 17)
        text = "午後很容易犯困呢，今天的運動目標完成了嗎？";
      else if (now > 17 && now <= 19)
        text = "傍晚了！窗外夕陽的景色很美麗呢～ 有去看看嗎？";
      else if (now > 19 && now <= 21)
        text = [
          "晚上好，今天過得怎麼樣？",
          "晚上好，今天也辛苦了，以後這樣的生活還會繼續吧？",
        ];
      else if (now > 21 && now <= 23)
        text = [
          "已經這麼晚了呀，早點休息吧，晚安～",
          "夜深了，記得要愛護自己眼睛呀！",
        ];
      else text = "你是夜貓子呀？這麼晚還不睡覺，明天起的來嘛？";
    }
    // else if (document.referrer !== "") {
    //   const referrer = new URL(document.referrer),
    //     domain = referrer.hostname.split(".")[1];
    //   if (location.hostname === referrer.hostname)
    //     text = `歡迎閱讀<span>「${document.title.split(" - ")[0]}」</span>`;
    //   else if (domain === "baidu")
    //     text = `Hello！來自 百度搜索 的朋友<br>你是搜索 <span>${
    //       referrer.search.split("&wd=")[1].split("&")[0]
    //     }</span> 找到的我嗎？`;
    //   else if (domain === "so")
    //     text = `Hello！來自 360搜索 的朋友<br>你是搜索 <span>${
    //       referrer.search.split("&q=")[1].split("&")[0]
    //     }</span> 找到的我嗎？`;
    //   else if (domain === "google")
    //     text = `Hello！來自 谷歌搜索 的朋友<br>歡迎閱讀<span>「${
    //       document.title.split(" - ")[0]
    //     }」</span>`;
    //   else text = `Hello！來自 <span>${referrer.hostname}</span> 的朋友`;
    // } else {
    //   text = `歡迎閱讀<span>「${document.title.split(" - ")[0]}」</span>`;
    // }
    showMessage(text, 7000, 8);
  })();

  function showHitokoto() {
    // hitokoto  API
    let hitokotoType = "c=d&c=e&c=f&c=k";
    fetch("https://v1.hitokoto.cn/?encode=text&" + hitokotoType)
      .then(async (response) => response.text())
      .then((data) => {
        const converter = OpenCC.Converter({ from: "cn", to: "hk" });
        const text = converter(data);
        showMessage(text, 7000, 9);
      })
      .catch((e) => {
        const text = "啊… 忘記要說什麼了。";
        showMessage(text, 6000, 9);
      });
  }

  function showMessage(text, timeout, priority) {
    if (
      !text ||
      (sessionStorage.getItem("waifu-text") &&
        sessionStorage.getItem("waifu-text") > priority)
    )
      return;
    if (messageTimer) {
      clearTimeout(messageTimer);
      messageTimer = null;
    }
    text = randomSelection(text);
    sessionStorage.setItem("waifu-text", priority);
    const tips = document.getElementById("waifu-tips");
    tips.innerHTML = text;
    tips.classList.add("waifu-tips-active");
    messageTimer = setTimeout(() => {
      sessionStorage.removeItem("waifu-text");
      tips.classList.remove("waifu-tips-active");
    }, timeout);
  }

  (function initModel() {
    let modelId = localStorage.getItem("live2d-model-id");
    let modelTextures = localStorage.getItem("live2d-model-textures");
    let modelTexturesId = localStorage.getItem("live2d-model-textures-id");
    if (modelId === null) {
      // 首次加載時顯示 Pio 指定皮膚
      modelId = 0; // 模型 ID
      modelTextures = "Pio/winter-coat-2017-costume-brown"; // 模型皮膚名稱
      modelTexturesId = 53; // 材質 ID
    }
    loadModel(modelId, modelTextures, modelTexturesId);

    fetch(waifuPath)
      .then((response) => response.json())
      .then((result) => {
        // 鼠標事件
        window.addEventListener("mouseover", (event) => {
          for (let { selector, text } of result.mouseover) {
            if (!event.target.matches(selector)) continue;
            text = randomSelection(text);
            text = text.replace("{text}", event.target.innerText);
            showMessage(text, 4000, 8);
            return;
          }
        });
        window.addEventListener("click", (event) => {
          for (let { selector, text } of result.click) {
            if (!event.target.matches(selector)) continue;
            text = randomSelection(text);
            text = text.replace("{text}", event.target.innerText);
            showMessage(text, 4000, 8);
            return;
          }
        });
        result.seasons.forEach(({ date, text }) => {
          const now = new Date(),
            after = date.split("-")[0],
            before = date.split("-")[1] || after;
          if (
            after.split("/")[0] <= now.getMonth() + 1 &&
            now.getMonth() + 1 <= before.split("/")[0] &&
            after.split("/")[1] <= now.getDate() &&
            now.getDate() <= before.split("/")[1]
          ) {
            text = randomSelection(text);
            text = text.replace("{year}", now.getFullYear());
            // showMessage(text, 7000, true);
            messageArray.push(text);
          }
        });
      });
  })();

  async function loadModelList() {
    const response = await fetch(`${cdnPath}model_list.json`);
    modelList = await response.json();
  }

  async function loadModel(modelId, modelTextures, modelTexturesId, message) {
    localStorage.setItem("live2d-model-id", modelId);
    localStorage.setItem("live2d-model-textures", modelTextures);
    localStorage.setItem("live2d-model-textures-id", modelTexturesId);
    showMessage(message, 4000, 10);
    if (useCDN) {
      var target;
      if (!modelList) await loadModelList();
      if (modelTextures === null) {
        target = randomSelection(modelList.models[modelId]);
      } else {
        target = modelTextures;
      }
      loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
      localStorage.setItem("live2d-model-textures", target);
    } else {
      loadlive2d("live2d", `${apiPath}get/?id=${modelId}-${modelTexturesId}`);
    }
  }

  async function loadRandModel() {
    const modelId = localStorage.getItem("live2d-model-id");
    const modelTextures = localStorage.getItem("live2d-model-textures");
    const modelTexturesId = localStorage.getItem("live2d-model-textures-id");
    if (useCDN) {
      var messageArray = [
        "喜歡這件衣服嗎？",
        "這件衣服好看嘛？",
        "這件衣服你喜歡嗎？",
      ];
      if (!modelList) await loadModelList();
      const target = randomSelection(modelList.models[modelId]);
      loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
      localStorage.setItem("live2d-model-textures", target);
      showMessage(randomSelection(messageArray), 4000, 10);
    } else {
      // 可选 "rand"(随机), "switch"(顺序)
      fetch(`${apiPath}rand_textures/?id=${modelId}-${modelTexturesId}`)
        .then((response) => response.json())
        .then((result) => {
          if (
            result.textures.id === 1 &&
            (modelTexturesId === 1 || modelTexturesId === 0)
          )
            showMessage("我還沒有其他衣服呢～", 4000, 10);
          else
            loadModel(modelId, null, result.textures.id, "我的新衣服好看嗎？");
        });
    }
  }

  async function loadOtherModel() {
    let modelId = localStorage.getItem("live2d-model-id");
    if (useCDN) {
      if (!modelList) await loadModelList();
      const index = ++modelId >= modelList.models.length ? 0 : modelId;
      loadModel(index, null, 0, modelList.messages[index]);
    } else {
      fetch(`${apiPath}switch/?id=${modelId}`)
        .then((response) => response.json())
        .then((result) => {
          loadModel(result.model.id, null, 0, result.model.message);
        });
    }
  }
}

function initWidget(config, apiPath) {
  if (typeof config === "string") {
    config = {
      waifuPath: config,
      apiPath,
    };
  }
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="waifu-toggle">
      <i class="fas fa-heart fa-beat" style="color:#d43f57"></i>
			<span>召喚</span>
		</div>`
  );
  const toggle = document.getElementById("waifu-toggle");
  toggle.addEventListener("click", () => {
    toggle.classList.remove("waifu-toggle-active");
    if (toggle.getAttribute("first-time")) {
      loadWidget(config);
      toggle.removeAttribute("first-time");
    } else {
      localStorage.removeItem("waifu-display");
      document.getElementById("waifu").style.display = "";
      setTimeout(() => {
        document.getElementById("waifu").style.bottom = 0;
      }, 0);
    }
  });
  if (
    localStorage.getItem("waifu-display") &&
    Date.now() - localStorage.getItem("waifu-display") <= 86400000
  ) {
    toggle.setAttribute("first-time", true);
    setTimeout(() => {
      toggle.classList.add("waifu-toggle-active");
    }, 0);
  } else {
    loadWidget(config);
  }
}
