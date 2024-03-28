// @ts-check
/// <reference path="./types.d.ts" />

const b = globalThis.browser ?? globalThis.chrome;

/** @type {MessageListner} */
const listner = (message, _sender, sendResponse) => {
  (async () => {
    try {
      if (message.action === "fetchSubtitles") {
        const { event, lang, videoId } = message.payload;
        const url = `https://tatzyr.github.io/subsubdeecee-vtts/${event}/${lang}/${videoId}.vtt`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP Error: status: ${res.status}, url: ${url}`);
        }
        sendResponse({ data: await res.text(), error: null });
      }
    } catch (e) {
      sendResponse({ data: null, error: { name: e.name, message: e.message } });
    }
  })();
  return true;
};

b.runtime.onMessage.addListener(listner);
