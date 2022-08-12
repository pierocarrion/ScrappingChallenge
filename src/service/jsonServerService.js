
class JsonServerService {
    uri = 'http://localhost:3000/';

    async postUrls(urls) {
        return fetch(this.uri + 'urls', {
            method: 'POST',
            body: JSON.stringify({ urls }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    async postProfiles(profile) {
        
        return fetch(this.uri + 'profiles', {
            method: 'POST',
            body: JSON.stringify({ profile }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }); 
    }
    async deleteUrls (){
        return fetch(this.uri + 'urls/1',{
            method: 'DELETE'
        })
    }
}
export default new JsonServerService();
