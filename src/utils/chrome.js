export async function injectScript(path, tabId){
    const options = {
        target: {tabId},
        files: [path]
    };

    return chrome.scripting.executeScript(options);
}

export async function changeTab(oldTabId, url){
    try{
        await chrome.tabs.remove(oldTabId);
        const { id } = await chrome.tabs.create({ url });
        return id;
    } catch(error) {
        console.log("🚀 ~ file: chrome.js ~ line 11 ~ changeTab ~ changeTab", changeTab)
        throw error;
    }
}
export async function getCurrentTab(){
    let queryOptions = {
        active: true,
        lastFocusedWindow: true
    };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}