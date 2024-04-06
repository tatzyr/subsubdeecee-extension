// biome-ignore lint/style/noVar:
declare var browser: import("webextension-polyfill").Browser;

type FetchLanguagesRequest = {
  action: "fetchLanguages";
  payload: {
    event: string;
  };
};

type FetchSubtitlesRequest = {
  action: "fetchSubtitles";
  payload: {
    event: string;
    lang: string;
    videoId: string;
  };
};

type FetchLanguagesResponse =
  | {
      data: string[];
      error: null;
    }
  | {
      data: null;
      error: Error;
    };

type FetchSubtitlesResponse =
  | {
      data: string;
      error: null;
    }
  | {
      data: null;
      error: Error;
    };

type MessageListener = (
  message: FetchLanguagesRequest | FetchSubtitlesRequest,
  sender: import("webextension-polyfill").Runtime.MessageSender,
  sendResponse: (response: FetchLanguagesResponse | FetchSubtitlesResponse) => void,
) => true;
