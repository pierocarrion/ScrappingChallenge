import { searchSelectors } from '../config/scrapper.config';
import { $ } from './selectors';

export async function waitForSelector(selector, intervalTime = 500, timeOut = 5000) {
    return new Promise((res, rej) => {
        let cont = 0;
        const interval = setInterval(() => {

            cont++;
            if(cont === timeOut/interval + 1) {
                clearInterval(interval);
                rej(false);
            }

            if($(selector)) {
                clearInterval(interval);
                res(true);
            }
        }, intervalTime);
        $(searchSelectors.paginateResultContainer);
    });
}

export async function waitForScroll(offSet = 100, time = 100, timeOut= 10000) {
    let y = 0;
    return new Promise((res, rej) => {
        const interval = setInterval(() => {
            if (y >= document.body.scrollHeight - document.body.scrollTop) {
                clearInterval(interval);
                res(true);
            }
            y += offSet;
            if(timeOut/time+1 > y/offSet+2*offSet) {
                clearInterval(interval);
                rej(false);
            }
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, time);
    });
}