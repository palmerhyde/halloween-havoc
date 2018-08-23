import * as Vibrant from 'node-vibrant'
import { getDominantColours, calculateCurrentIndex } from './monsterColours'

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
        expect.assertions(4);
        return getDominantColours('https://i.scdn.co/image/59ca77d06b806858e0591523e638a998b953a8ea')
            .then(colours => {
                expect(colours).not.toBeUndefined();
                expect(colours[0]).toEqual({r: 53, g: 168, b: 203});
                expect(colours[1]).toEqual({r: 12, g: 38, b: 46});
                expect(colours[2]).toEqual({r: 47, g: 47, b: 47});
            });
    });

    it('Current Colour index less than equal to the length of colours', () => {
        const colours = [
            {r: 53, g: 168, b: 203},
            {r: 12, g: 38, b: 46},
            {r: 47, g: 47, b: 47},
            {r: 53, g: 168, b: 203},
            {r: 12, g: 38, b: 46},
            {r: 47, g: 47, b: 47}
        ];
        const currentIndex = calculateCurrentIndex(2, colours);

        expect.assertions(1);
        expect(currentIndex).toBe(3);
    });

    it('Current Colour index -1 than equal 0', () => {
        const colours = [
            {r: 53, g: 168, b: 203},
            {r: 12, g: 38, b: 46},
            {r: 47, g: 47, b: 47},
            {r: 53, g: 168, b: 203},
            {r: 12, g: 38, b: 46},
            {r: 47, g: 47, b: 47}
        ];
        const currentIndex = calculateCurrentIndex(-1, colours);

        expect.assertions(1);
        expect(currentIndex).toBe(0);
    });

    it('Current Colour index greater than equal to the length of colours', () => {
        const colours = [
            {r: 53, g: 168, b: 203},
            {r: 12, g: 38, b: 46},
            {r: 47, g: 47, b: 47},
            {r: 53, g: 168, b: 203},
            {r: 12, g: 38, b: 46},
            {r: 47, g: 47, b: 47}
        ];
        const currentIndex = calculateCurrentIndex(5, colours);

        expect.assertions(1);
        expect(currentIndex).toBe(0);
    });
});