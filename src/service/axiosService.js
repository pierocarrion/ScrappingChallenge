import axios from 'axios';
import { urls as configUrls } from '../config/scrapper.config';
import { TOKENS } from '../utils/constants';
import { getCookie } from '../utils/cookie';

const { baseUrl, api } = configUrls;
const baseUrlAxios = baseUrl + api;
class AxiosService {
    axiosInstance = axios;
    token = getCookie(TOKENS.CSRF, document.cookie);

    async getLinkedinJson(url) {
        try {

            const { data } = await this.axiosInstance.get(url,
                {
                    headers: {
                        accept: 'application/vnd.linkedin.normalized+json+2.1',
                        'csrf-token': this.token,
                        'x-li-lang': 'es_ES',   
                        // 'x-li-page-instance': ,
                        // 'x-li-deco-include-micro-schema': true,
                        'x-restli-protocol-version': '2.0.0',
                        // 'x-li-page-instance': '
                    }
                });

            return data;
        } catch (error) {
            console.log('🚀 axiosService.js ~ getLinkedinJson ~ error', error);
            throw error;
        }
    }

    async getPaginate10Results(
        keywords = 'full%20stack',
        startPaginate = 0,
        list = 'PEOPLE',
        includeFilter = false,
        searchId = '00af5496-3e03-4913-9849-c47708dff823'
    ) {
        // const url = `${baseUrlAxios}search/dash/clusters?` +
        //     'decorationId=' +
        //     'com.linkedin.voyager.dash.deco.search.SearchClusterCollection-157'+
        //     '&origin=SWITCH_SEARCH_VERTICAL' +
        //     '&q=all&query=(' +
        //     `keywords:${keywords},` +
        //     'flagshipSearchIntent:SEARCH_SRP,' +
        //     'queryParameters:(position:List(0),' +
        //     `resultType:List(${list}),` +
        //     `searchId:List(${searchId})),` +
        //     `includeFiltersInResponse:${includeFilter})&start=${startPaginate}`;
            
        
        const url = `${baseUrlAxios}search/dash/clusters?decorationId=com.linkedin.voyager.dash.deco.search.SearchClusterCollection-158`+
        '&origin=SWITCH_SEARCH_VERTICAL'+
        '&q=all&'+
        'query=('+
        `keywords:${keywords},`+
        'flagshipSearchIntent:SEARCH_SRP,'+ 
        'queryParameters:(resultType:List(PEOPLE)),'+
        `includeFiltersInResponse:false)&start=${startPaginate}`

        return this.getLinkedinJson(url);
    }
    

}

export default new AxiosService();