import {filterMonstersByArtist} from "./monsters";
import monsterData from '../../data/monsters.json'

describe('Monsters by artist filter', () => {

    it('filters and returns eddie monsters when artist is iron maiden', () => {
        expect.assertions(1);
        const localMonsterData = monsterData;
        const artist = 'Iron Maiden';
        const filteredMonsters = filterMonstersByArtist(localMonsterData.monsters, artist);
        expect(filteredMonsters.length).toBe(2);
    });

    it('filters and returns zero monsters when artist is the clash', () => {
        expect.assertions(1);
        const localMonsterData = monsterData;
        const artist = 'The Clash';
        const filteredMonsters = filterMonstersByArtist(localMonsterData.monsters, artist);
        expect(filteredMonsters.length).toBe(0);
    });
});