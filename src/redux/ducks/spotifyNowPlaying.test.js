import axios from "axios/index";

describe('Integration: Spotify Service', () => {

    it('returns no token error', () => {
        expect.assertions(1);

        return axios({
            method: "get",
            url: `https://api.spotify.com/v1/me/player/currently-playing`
        })
            .catch(error => {
                expect(error.message).toMatch('Request failed with status code 401');
            });
    });

    it('returns invalid token error', () => {
        expect.assertions(1);

        return axios({
            method: "get",
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer invalidtoken'
            }

        })
            .catch(error => {
                expect(error.response.data.error.message).toMatch('Invalid access token');
            });
    });

    it('returns expired token error', () => {
        expect.assertions(1);

        return axios({
            method: "get",
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer BQD6kTypfXLqRoUpSU9N2oeXO6Vh0Sfs3dTeB7ITtRXLIFV-81tWRF-rErMzzyGRYxizpfs0qnioabXimDUfYgtnL1cV44ZAm4QxVJ-pVidNzMsnh7OlUI0WtGoTtq7Ihnk7815dZDTUIwIJ6Y4BOBY'
            }

        })
            .catch(error => {
                expect(error.response.data.error.message).toMatch('The access token expired');
            });
    });

    it('returns valid now playing result', () => {
        // Non deterministic test. How do we make deterministic? We need a way of requesting access tokens

        expect.assertions(1);

        // DEMO: Step X - Replace token with spotify access token here
        const token = 'BQCvoK_2qkEFgjmcZ3ai0UT2M3shmEcVB8Pq5w9WltX70jvDWUfMA8YhKk_Xugbrcc6pAW4buVzgALx-4y1VPlfgRP9g3XwzEUIF2NN8KVFYOqmFLyGOJ69F5RKyREHd_IALqy9V7moX2Q3SJNYK_0hS8w';

        return axios({
            method: "get",
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                expect(response.data.item).not.toBeUndefined();
            });
    });
});