import { all } from 'redux-saga/effects';
import { watcherMonsterSaga } from './ducks/monsters';
import { watcherDogSaga } from './ducks/dogs';
import { watcherNowPlayingSaga } from './ducks/spotifyNowPlaying';


/**
 * The rootSaga combines all Sagas which listen for events.
 * @return {Generator} watcher saga
 */
export default function* rootSaga() {
    yield all([
        watcherMonsterSaga(),
        watcherDogSaga(),
        watcherNowPlayingSaga()
    ]);
}