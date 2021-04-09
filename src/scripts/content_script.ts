import { nebula } from "./pages/watchnebula/_nebula";
import { c, getBrowserInstance, injectScript } from "./_sharedBrowser";

const b = getBrowserInstance();
const local = b.storage.local;

// handle messaging with injected script(s)
const replyEvent = (e: CustomEvent, data: any, err?: any) => e.detail.name && !document.dispatchEvent(new CustomEvent(e.detail.name, { detail: c({ res: data, err: err }) }));
const storageGet = (e: CustomEvent) => local.get(e.detail.get).then(r => replyEvent(e, typeof e.detail.get == 'string' ? r[e.detail.get] : r), (r: any) => replyEvent(e, null, r));
const storageSet = (e: CustomEvent) => local.set(e.detail.set).then(() => replyEvent(e, null), (r: any) => replyEvent(e, null, r));
const getMessage = (e: CustomEvent) => replyEvent(e, b.i18n.getMessage(e.detail.message, e.detail.substitutions));
const getAndroid = (e: CustomEvent) => b.runtime.sendMessage("isAndroid").then((m: any) => replyEvent(e, m));


const zype = async () => {
    // inject extension's script
    await injectScript(b.runtime.getURL('/scripts/pages/zype/zype.js'), document.body);
    // inject custom script (if available)
    const s = (await local.get({ customScript: '' })).customScript;
    if (s)
        injectScript(document.body, s);
};

(() => {
    document.addEventListener('enhancer-storageGet', storageGet);
    document.addEventListener('enhancer-storageSet', storageSet);
    document.addEventListener('enhancer-getMessage', getMessage);
    document.addEventListener('enhancer-isAndroid', getAndroid);

    switch (document.location.host) {
        case "player.zype.com":
        case "content.watchnebula.com":
            zype();
            break;
        case "watchnebula.com":
        default:
            nebula();
            break;
    }
})();

