import monsters from './ducks/monsters';
import nowPlaying from './ducks/spotifyNowPlaying';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    monsters,
    nowPlaying
});

export default rootReducer;