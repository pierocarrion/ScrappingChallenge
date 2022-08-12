
import {
    profileSelectors,
    urls as configUrls,
} from '../config/scrapper.config';
import { $, $$ } from '../utils/selectors';
import { getCookie } from '../utils/cookie';
import { parseDate } from '../utils/dates';
import { SECURE_CHANNELS } from '../utils/constants';
import { waitForScroll, waitForSelector } from '../utils/waitFor';
import axios from 'axios';

const port = chrome.runtime.connect({ name: SECURE_CHANNELS.SCRAP_PROFILE });

async function getContactInfoWithAPI() {
    try {
        const { baseUrl, api, urlContactInfo } = configUrls;
        const token = getCookie('JSESSIONID', document.cookie);

        const [contactInfoName] =
            $(profileSelectors.contactInfo).href.match(/in\/.+\/o/) ?? [];

        const contactInfoURL = baseUrl + api + urlContactInfo(contactInfoName);

        const {
            data: { data },
        } = await axios.get(contactInfoURL, {
            headers: {
                accept: 'application/vnd.linkedin.normalized+json+2.1',
                'csrf-token': token,
            },
        });

        return data;
    } catch (error) {
        console.log('getContacInfo', error);
        throw error;
    }
}
function getInfoWithSelector(selector) {
    try {
        const data = $$(selector);

        return data.map((listItem) => {
            if (!$('.pvs-entity__path-node', listItem)) {
                const [title, enterprise, dateStringInfo] = $$(
                    'span[aria-hidden]',
                    listItem
                ).map((element) => element.textContent);
                if (dateStringInfo !== undefined) {
                    const [parsedRawDate] =
                        dateStringInfo?.match(/.+·|\d{4} - \d{4}/) ?? [];

                    const [startDate, endDate] = (
                        parsedRawDate?.replace(/\s|·/g, '').split('-') ?? []
                    ).map((rawDateElement) => parseDate(rawDateElement));

                    return { title, enterprise, startDate, endDate };
                } else {
                    const [startYear, endYear] = enterprise
                        .split('-')
                        .map((e) => {
                            e.trim();
                        });
                    return {
                        title,
                        enterprise: title,
                        startDate: startYear,
                        endDate: endYear,
                    };
                }
            }
        });
    } catch (error) {
        console.log('getInfoWithSelector', error);
        throw error;
    }
}

async function getDataWithSelectors() {
    await waitForSelector('h1');
    await waitForScroll();

    const name = $(profileSelectors.name).textContent;
    const experiences = getInfoWithSelector(
        profileSelectors.experiencesElements
    );
    const educations = getInfoWithSelector(profileSelectors.educationElements);

    return {
        name,
        experiences,
        educations,
    };
}
async function scrapProfile() {
    try {
        const [contactInfoByAPI, profileInfoWithSelectors] = await Promise.all([
            getContactInfoWithAPI(),
            getDataWithSelectors(),
        ]);
        const profile = {
            ...profileInfoWithSelectors,
            contactInfoByAPI,
        };
        console.log("Profile before post: ",profile)
        port.postMessage({ profile });
    } catch (error) {
        console.log("🚀 ~ file: scrapProfiles.js ~ line 111 ~ scrapProfile ~ error", error)
        throw error;
    }
}
scrapProfile();
