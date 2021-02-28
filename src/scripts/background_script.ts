import { getBrowserInstance } from './_sharedBrowser';
import { creator, creatorHasVideo, loadCreators as _loadCreators } from './_youtube';

let videoFetch = 100;

function isAndroid() {
    return getBrowserInstance().runtime.getPlatformInfo().then(information => information.os === 'android');
}

getBrowserInstance().browserAction.onClicked.addListener(async function () {
    const android = await isAndroid();
    // Avoid blank page in firefox android
    // Taken from https://git.synz.io/Synzvato/decentraleyes/-/blob/master/pages/popup/popup.js#L391
    if (android) {
        getBrowserInstance().tabs.create({
            'url': getBrowserInstance().runtime.getURL('options/index.html'),
            'active': true
        });
    } else {
        getBrowserInstance().runtime.openOptionsPage();
    }
});

getBrowserInstance().runtime.onMessage.addListener((message: string | { [key: string]: any }, sender, sendResponse) => {
    if (typeof message === "string") message = { type: message };
    switch (message.type) {
        case "isAndroid":
            return isAndroid();
        case "loadCreators":
            return loadCreators();
        case "getYoutubeId":
            const s = (n: string) => n.trim().replaceAll(' ', '').toLowerCase();
            const c: string = message.creator;
            const c2 = s(c);
            const t: string = message.title;
            return loadCreators().then(creators => 
                creatorHasVideo(creators.find(e => e.name === c || s(e.name) === c2)?.uploads, t, videoFetch));
    }
});

const loadCreators = (() => {
    let promise: Promise<creator[]> = null;
    return () => {
        if (promise) return promise;
        return promise = _loadCreators();
    };
})();

(async () => {
    const yt: boolean = (await getBrowserInstance().storage.local.get({ youtube: false })).youtube;
    if (!yt) return;
    loadCreators();
})();