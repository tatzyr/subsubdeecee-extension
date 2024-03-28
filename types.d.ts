// biome-ignore lint/style/noVar:
declare var browser: import("webextension-polyfill").Browser;

type MessageRequest = {
  action: "fetchSubtitles";
  payload: {
    event: string;
    lang: string;
    videoId: string;
  };
};

type MessageResponse =
  | {
      data: string;
      error: null;
    }
  | {
      data: null;
      error: Error;
    };

type MessageListner = (
  message: MessageRequest,
  sender: import("webextension-polyfill").Runtime.MessageSender,
  sendResponse: (response: MessageResponse) => void,
) => true;
