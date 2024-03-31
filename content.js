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

    const languages = {
      ja: "日本語",
      ko: "한국어",
      th: "ภาษาไทย",
      vi: "Tiếng Việt",
    };

    for (const [lang, langLabel] of Object.entries(languages)) {
      const b = globalThis.browser ?? globalThis.chrome;
      /** @type {MessageRequest} */
      const message = { action: "fetchSubtitles", payload: { event, lang, videoId } };
      /** @type {MessageResponse} */
      const { data, error } = await b.runtime.sendMessage(message);
      if (error) {
        console.error(`Failed to fetch subtitles. ${error.name}: ${error.message}`);
        continue;
      }
      const track = document.createElement("track");
      track.setAttribute("src", URL.createObjectURL(new Blob([data], { type: "text/vtt" })));
      track.setAttribute("srclang", lang);
      track.setAttribute("label", `${langLabel} (SubSubDeeCee)`);

      video.appendChild(track);
    }
  }

  main().catch(console.error);
})();
