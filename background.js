// @ts-check

/** @type {import("webextension-polyfill").Browser} */
// @ts-ignore
const b = chrome;

b.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message.action === "fetchSubtitles" && message.url) {
      try {
        const res = await fetch(message.url);
        if (!res.ok) {
          throw new Error(`HTTP Error: status: ${res.status}, url: ${message.url}`);
        }
        // @ts-ignore
        sendResponse({ data: await res.text(), error: null });
      } catch (e) {
        // @ts-ignore
        sendResponse({ data: null, error: { name: e.name, message: e.message } });
      }
    }
  })();
  return true;
});
