// @ts-check

/**
 * @param {import("webextension-polyfill").WebRequest.OnHeadersReceivedDetailsType} details
 */
function handleHeaders(details) {
  if (!details.responseHeaders) {
    return;
  }
  for (let i = 0; i < details.responseHeaders.length; i++) {
    if (details.responseHeaders[i].name.toLowerCase() === "content-security-policy") {
      // @ts-ignore
      details.responseHeaders[i].value = details.responseHeaders[i].value.replace("default-src 'self'", "default-src 'self' tatzyr.github.io")
    }
  }

  return { responseHeaders: details.responseHeaders }
}

function init() {
  /**
   * @type {import("webextension-polyfill").Browser}
   */
  // @ts-ignore
  const b = chrome;

  /**
   * @type {import("webextension-polyfill").WebRequest.RequestFilter}
   */
  const filter = { urls: ['https://developer.apple.com/*'], types: ['main_frame', 'sub_frame'] };
  b.webRequest.onHeadersReceived.addListener(handleHeaders, filter, ["blocking", "responseHeaders"]);
}

init();
