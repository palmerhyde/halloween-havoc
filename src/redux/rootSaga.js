import { all } from 'redux-saga/effects';
import {
    watcherMonsterSaga,
    watcherSetMonstersDominantColoursSaga,
    watcherSetMonsterColourSaga,
    watcherDiscoverPhysicalMonsterSaga
     } from './ducks/monsters';
import { watcherNowPlayingSaga, watcherSetNowPlayingAuthTokenSaga } from './ducks/spotifyNowPlaying';


/**
 * The rootSaga combines all Sagas which listen for events.
 * @return {Generator} watcher saga
 */
export default function* rootSaga() {
    yield all([
        watcherMonsterSaga(),
        watcherNowPlayingSaga(),
        watcherSetMonstersDominantColoursSaga(),
        watcherSetMonsterColourSaga(),
        watcherSetNowPlayingAuthTokenSaga(),
        watcherDiscoverPhysicalMonsterSaga()
    ]);
}