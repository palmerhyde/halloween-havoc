import monsters from './ducks/monsters';
import nowPlaying from './ducks/spotifyNowPlaying';
import monsterColours from './ducks/monsterColours';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    monsters,
    nowPlaying,
    monsterColours
});

export default rootReducer;