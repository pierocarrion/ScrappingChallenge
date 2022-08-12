import jsonServerService from './service/jsonServerService';
import { changeTab, injectScript } from './utils/chrome';
import { SECURE_CHANNELS, TIME } from './utils/constants';


chrome.action.onClicked.addListener((tab) => {
    injectScript('scripts/scrapCandidates.js', tab.id);
});

chrome.runtime.onConnect.addListener((port) => {
    if (!Object.values(SECURE_CHANNELS).includes(port.name))
        throw new Error('Not secure Channel');

    port.onMessage.addListener(_portMessageHandler);
});

_portMessageHandler = async (msg, port) => {
    const { urls, profile } = msg;
    const {
        name,
        sender: {
            tab: { id: tabId, url: tabUrl },
        },
    } = port;

    switch (name) {
        case SECURE_CHANNELS.SCRAP_PROFILE: {
            console.log("Profile from Port",profile)

            saveProfile(profile).then(()=>{
                console.log("Profile saved", profile)
            }).catch(error=>{
                console.log("🚀 ~ file: sw.js ~ line 34 ~ saveProfile ~ error", error)
            })
            
            break;
        }
        case SECURE_CHANNELS.SCRAP_CANDIDATES: {
            saveUrlCandidates(urls).then(async (urls) => {
                console.log('Incoming URLs', urls);
                
                let prevId = tabId;
                for(let i = 0; i<urls.urls.length; i++){

                    let url = urls.urls[i].url;

                    await sleep(TIME.SCRAP_AVG_TIME).then(async ()=>{
                        prevId = await scrapNewTab(url, prevId) 
                    })
                }

                jsonServerService.deleteUrls();
                /*
                urls.urls.forEach(async (element) => {
                    const { url } = element;
                    sleep(10000).then(async () => { prevId = await OpenNewTab(url, prevId) });
                    
                    console.log("🚀 ~ file: sw.js ~ line 47 ~ urls.urls.forEach ~ prevId", prevId)
                    
                });*/
                
            });
            break;
        }
        default:
            console.log('SWITCH - DEFAULT');
            break;
    }
};
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}
async function scrapNewTab(url, prevId){
    const id = await changeTab(prevId, url);
    
    injectScript('scripts/scrapProfiles.js', id);
    
    return id;
}
async function saveUrlCandidates(urls) {
    if (!urls.length) {
        throw new Error('No data - Urls');
    }
    jsonServerService.postUrls(urls).then(() => {
        console.log('Saved Data - Urls');
    });
    return { urls };
}

async function saveProfile(profile) {
    
    jsonServerService.postProfiles(profile).then(() => {
        console.log('Saved Data - Profiles');
    });
}
