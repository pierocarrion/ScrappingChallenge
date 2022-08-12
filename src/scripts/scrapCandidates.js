
import axiosService from '../service/axiosService';
import { SECURE_CHANNELS } from '../utils/constants';

const port = chrome.runtime.connect({ name: SECURE_CHANNELS.SCRAP_CANDIDATES });

async function scrapCandidates(keywords, startPaginate = 0) {

    let pagination = startPaginate;
    let urls = [];

    do {
        
        
        const { included } = await axiosService.getPaginate10Results(
            parseText(keywords),
            pagination
        );
        const nextCandidates =
        included
        ?.filter((includedElement) => includedElement?.trackingUrn)
        .map((filteredIncluded) => {
            const raw = filteredIncluded?.navigationContext?.url;
            const [profileVar] = raw.match(/urn.+/) ?? [];
            
                
                    return {
                        url: raw,
                        profileVar: profileVar
                            ?.replace('miniP', 'p')
                            ?.replace('Afs', 'Afsd'),
                    };
                }) ?? [];

        if (nextCandidates === undefined)
             break;

        urls = [...urls, ...nextCandidates];

        pagination += 10;

        //TO-DO: encontrar el total o el max de paginacion en la res de la query
    } while (pagination < 10);

    port.postMessage({ urls });

    return urls;
}
function parseText(rawText){
    return rawText.replaceAll(' ', '%20');
}
const keywordToLookFor = 'full stack'
scrapCandidates(keywordToLookFor);