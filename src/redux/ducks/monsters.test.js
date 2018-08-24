import {filterMonsters} from "./monsters";
import monsterData from '../../data/monsters.json'

describe('Monsters by artist filter', () => {

    it('filters and returns discovered eddie monsters in AUTO mode when artist is iron maiden', () => {
        expect.assertions(1);
        const localMonsterData = monsterData.monsters;
        localMonsterData[0].mode = 'AUTO';
        localMonsterData[0].discovered = true;
        localMonsterData[1].mode = 'AUTO';
        localMonsterData[1].discovered = true;
        const artist = 'Iron Maiden';

        const filteredMonsters = filterMonsters(localMonsterData, artist);
        expect(filteredMonsters.length).toBe(2);
    });

    it('filters and returns zero eddie monsters in MANUAL mode when artist is iron maiden', () => {
        expect.assertions(1);
        const localMonsterData = monsterData.monsters;
        localMonsterData[0].mode = 'MANUAL';
        localMonsterData[0].discovered = true;
        localMonsterData[1].mode = 'MANUAL';
        localMonsterData[1].discovered = true;
        const artist = 'Iron Maiden';

        const filteredMonsters = filterMonsters(localMonsterData, artist);
        expect(filteredMonsters.length).toBe(0);
    });

    it('filters and returns zero eddie monsters in AUTO mode when artist is iron maiden when monster is not discovered', () => {
        expect.assertions(1);
        const localMonsterData = monsterData.monsters;
        localMonsterData[0].mode = 'AUTO';
        localMonsterData[0].discovered = false;
        localMonsterData[1].mode = 'AUTO';
        localMonsterData[1].discovered = false;
        const artist = 'Iron Maiden';

        const filteredMonsters = filterMonsters(localMonsterData, artist);
        expect(filteredMonsters.length).toBe(0);
    });

    it('filters and returns zero monsters when artist is the clash', () => {
        expect.assertions(1);
        const localMonsterData = monsterData.monsters;
        const artist = 'The Clash';
        const filteredMonsters = filterMonsters(localMonsterData, artist);
        expect(filteredMonsters.length).toBe(0);
    });
});