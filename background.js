// @ts-check
/// <reference path="./types.d.ts" />

const b = globalThis.browser ?? globalThis.chrome;

/** @type {(vttText: string) => string} */
const enhanceVtt = (vttText) => {
  const isChromium = !globalThis.browser && globalThis.chrome;
  // In Firefox, subtitles are already easy to read so do nothing.
  if (!isChromium) {
    return vttText;
  }
  // In Chromium (Chrome, Chromium Edge), add styles to subtitles.
  return vttText.replace(
    /^WEBVTT\n\n/,
    `WEBVTT

STYLE
::cue {
  color: #ffffff;
  font-size: 1em;
  font-weight: 600;
  /* background is not supported so use text-shadow instead */
  text-shadow: #000000 0px 0px 0.2em, #000000 0px 0px 0.2em, #000000 0px 0px 0.2em, #000000 0px 0px 0.2em;
}

`,
  );
};

/** @type {(event: string) => Promise<string[]>} */
const fetchLanguages = async (event) => {
  const url = `https://subsubdeecee-vtts.pages.dev/${event}/languages.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP Error: status: ${res.status}, url: ${url}`);
  }
  return (await res.json()).languages;
};

/** @type {(event: string, lang: string, videoId: string) => Promise<string>} */
const fetchSubtitles = async (event, lang, videoId) => {
  const url = `https://subsubdeecee-vtts.pages.dev/${event}/${lang}/${videoId}.vtt`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP Error: status: ${res.status}, url: ${url}`);
  }
  return await res.text();
};

/** @type {MessageListener} */
const listener = (message, _sender, sendResponse) => {
  (async () => {
    try {
      if (message.action === "fetchLanguages") {
        const { event } = message.payload;
        const data = await fetchLanguages(event);
        sendResponse({ data, error: null });
      } else if (message.action === "fetchSubtitles") {
        const { event, lang, videoId } = message.payload;
        const data = await fetchSubtitles(event, lang, videoId);
        sendResponse({ data: enhanceVtt(data), error: null });
      }
    } catch (e) {
      sendResponse({ data: null, error: { name: e.name, message: e.message } });
    }
  })();
  return true;
};

b.runtime.onMessage.addListener(listener);
