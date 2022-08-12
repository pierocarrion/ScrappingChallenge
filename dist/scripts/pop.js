(() => {
  // src/config/scrapper.config.js
  var urls = {
    baseUrl: "https://www.linkedin.com/",
    api: "voyager/api/",
    urlContactInfo: (contactInfoName) => `identity/profiles${contactInfoName.slice(2, -2)}/profileContactInfo`
  };

  // src/utils/selectors.js
  function $(selector, node = document.body) {
    return node.querySelector(selector);
  }

  // src/scripts/pop.js
  document.getElementById("#search-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const { baseUrl } = urls;
    const keyword = $("#to-search", e.target).value;
    const url = baseUrl + "search/results/people/?keywords=" + keyword;
    const { id } = await chrome.tabs.create({ url });
    const options = {
      target: { tabId: id },
      files: ["scripts/scrapCandidates.js"]
    };
    chrome.scripting.executeScript(options);
  });
})();
