import monsters from './ducks/monsters';
import dog from './ducks/dogs';
import nowPlaying from './ducks/spotifyNowPlaying';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    monsters,
    dog,
    nowPlaying
});

export default rootReducer;