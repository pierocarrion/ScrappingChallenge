(() => {
  // src/service/jsonServerService.js
  var JsonServerService = class {
    uri = "http://localhost:3000/";
    async postUrls(urls) {
      return fetch(this.uri + "urls", {
        method: "POST",
        body: JSON.stringify({ urls }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
    }
    async postProfiles(profile) {
      return fetch(this.uri + "profiles", {
        method: "POST",
        body: JSON.stringify({ profile }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
    }
    async deleteUrls() {
      return fetch(this.uri + "urls/1", {
        method: "DELETE"
      });
    }
  };
  var jsonServerService_default = new JsonServerService();

  // src/utils/chrome.js
  async function injectScript(path, tabId) {
    const options = {
      target: { tabId },
      files: [path]
    };
    return chrome.scripting.executeScript(options);
  }
  async function changeTab(oldTabId, url) {
    try {
      await chrome.tabs.remove(oldTabId);
      const { id } = await chrome.tabs.create({ url });
      return id;
    } catch (error) {
      console.log("\u{1F680} ~ file: chrome.js ~ line 11 ~ changeTab ~ changeTab", changeTab);
      throw error;
    }
  }

  // src/utils/constants.js
  var SECURE_CHANNELS = {
    SCRAP_PROFILE: "secureChannelScrapProfile",
    SCRAP_CANDIDATES: "secureChannelScrapCandidate"
  };
  var TIME = {
    SCRAP_AVG_TIME: 20
  };

  // src/sw.js
  chrome.action.onClicked.addListener((tab) => {
    injectScript("scripts/scrapCandidates.js", tab.id);
  });
  chrome.runtime.onConnect.addListener((port) => {
    if (!Object.values(SECURE_CHANNELS).includes(port.name))
      throw new Error("Not secure Channel");
    port.onMessage.addListener(_portMessageHandler);
  });
  _portMessageHandler = async (msg, port) => {
    const { urls, profile } = msg;
    const {
      name,
      sender: {
        tab: { id: tabId, url: tabUrl }
      }
    } = port;
    switch (name) {
      case SECURE_CHANNELS.SCRAP_PROFILE: {
        console.log("Profile from Port", profile);
        saveProfile(profile).then(() => {
          console.log("Profile saved", profile);
        }).catch((error) => {
          console.log("\u{1F680} ~ file: sw.js ~ line 34 ~ saveProfile ~ error", error);
        });
        break;
      }
      case SECURE_CHANNELS.SCRAP_CANDIDATES: {
        saveUrlCandidates(urls).then(async (urls2) => {
          console.log("Incoming URLs", urls2);
          let prevId = tabId;
          for (let i = 0; i < urls2.urls.length; i++) {
            let url = urls2.urls[i].url;
            await sleep(TIME.SCRAP_AVG_TIME).then(async () => {
              prevId = await scrapNewTab(url, prevId);
            });
          }
          jsonServerService_default.deleteUrls();
        });
        break;
      }
      default:
        console.log("SWITCH - DEFAULT");
        break;
    }
  };
  function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
  }
  async function scrapNewTab(url, prevId) {
    const id = await changeTab(prevId, url);
    injectScript("scripts/scrapProfiles.js", id);
    return id;
  }
  async function saveUrlCandidates(urls) {
    if (!urls.length) {
      throw new Error("No data - Urls");
    }
    jsonServerService_default.postUrls(urls).then(() => {
      console.log("Saved Data - Urls");
    });
    return { urls };
  }
  async function saveProfile(profile) {
    jsonServerService_default.postProfiles(profile).then(() => {
      console.log("Saved Data - Profiles");
    });
  }
})();
