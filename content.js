// @ts-check
/// <reference path="./types.d.ts" />

(() => {
  async function main() {
    const m = location.href.match(/^https:\/\/developer\.apple\.com\/videos\/play\/([^/]+)\/([^/]+)/);
    if (!m) {
      return;
    }
    const [, event, videoId] = m;

    /** @type {HTMLVideoElement | null} */
    let video;
    while (true) {
      video = document.querySelector("video#video");
      if (video) {
        break;
      }
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    }

    const b = globalThis.browser ?? globalThis.chrome;

    /** @type {FetchLanguagesRequest} */
    const message = { action: "fetchLanguages", payload: { event } };
    /** @type {FetchLanguagesResponse} */
    const { data: languages, error } = await b.runtime.sendMessage(message);
    if (error) {
      console.error(`Failed to fetch languages. ${error.name}: ${error.message}`);
      return;
    }

    for (const lang of languages) {
      /** @type {FetchSubtitlesRequest} */
      const message = { action: "fetchSubtitles", payload: { event, lang, videoId } };
      /** @type {FetchSubtitlesResponse} */
      const { data: vttText, error } = await b.runtime.sendMessage(message);
      if (error) {
        console.error(`Failed to fetch subtitles. ${error.name}: ${error.message}`);
        continue;
      }
      const track = document.createElement("track");
      track.setAttribute("src", URL.createObjectURL(new Blob([vttText], { type: "text/vtt" })));
      track.setAttribute("srclang", lang);
      const langLabel = new Intl.DisplayNames([], { type: "language" }).of(lang);
      track.setAttribute("label", `${langLabel} (SubSubDeeCee)`);

      video.appendChild(track);
    }
  }

  main().catch(console.error);
})();
