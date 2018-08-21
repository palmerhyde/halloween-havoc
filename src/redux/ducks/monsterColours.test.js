import * as Vibrant from 'node-vibrant'
import { getDominantColours } from './monsterColours'

describe('Integration: Vibrant', () => {

    it('Gets the dominant colours from an image url', () => {
        expect.assertions(1);

        // DEMO: Step X - Replace image with Audience Image below
        // DEMO: Place link to github repo for ndde-vibrant here.
        return Vibrant.from('https://i.scdn.co/image/59ca77d06b806858e0591523e638a998b953a8ea').getPalette()
            .then(response => {
                expect(response.Vibrant).not.toBeUndefined();
            })
    });
});

describe('Integration: Dominant Colours Service', () => {

    it('Gets the dominant colours from an image url', () => {
        expect.assertions(1);
        return getDominantColours('https://i.scdn.co/image/59ca77d06b806858e0591523e638a998b953a8ea')
            .then(colours => {
                // Validate correct shape
                expect(colours).not.toBeUndefined();
            });
    });
});