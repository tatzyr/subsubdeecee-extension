// @ts-check
/// <reference path="./types.d.ts" />

(function () {
  async function main() {
    const m = location.href.match(/^https:\/\/developer\.apple\.com\/videos\/play\/([^/]+)\/([^/]+)/);
    if (!m) {
      return;
    }
    const [, event, videoId] = m;

    let video;
    while (true) {
      video = document.querySelector("video#video");
      if (video) {
        break;
      }
      await new Promise((resolve) => { setTimeout(resolve, 100); });
    }

    for (const lang of ["ja", "ko", "vi"]) {
      const b = globalThis.browser ?? globalThis.chrome;
      const { data, error } = await b.runtime.sendMessage({
        action: "fetchSubtitles",
        url: `https://tatzyr.github.io/subsubdeecee-vtts/${event}/${lang}/${videoId}.vtt`,
      });
      if (error) {
        console.error(`Failed to fetch subtitles. ${error.name}: ${error.message}`);
        continue;
      }
      const track = document.createElement("track");
      track.setAttribute("src", URL.createObjectURL(new Blob([data], { type: "text/vtt" })));
      track.setAttribute("srclang", lang);
      track.setAttribute("label", `SubSubDeeCee (${lang})`);

      video.appendChild(track);
    }
  }

  main().catch(console.error);
})();
