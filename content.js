// @ts-check

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

    video.setAttribute("crossorigin", "anonymous");
    for (const lang of ["ja", "ko", "vi"]) {
      const track = document.createElement("track");
      track.setAttribute("src", `https://tatzyr.github.io/subsubdeecee-vtts/${event}/${lang}/${videoId}.vtt`);
      track.setAttribute("srclang", lang);
      track.setAttribute("label", `SubSubDeeCee (${lang})`);

      track.addEventListener("error", () => {
        console.error(`Failed to load WebVTT file for ${lang}`);
        video.removeChild(track);
      });

      video.appendChild(track);
    }
  }

  main().catch(console.error);
})();
