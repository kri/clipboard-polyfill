import { TEXT_PLAIN } from "./data-types";
import { DT } from "./DT";

/******** Internet Explorer ********/

interface IEWindow extends Window {
  clipboardData: {
    setData: (key: string, value: string) => boolean;
    // Always results in a string: https://msdn.microsoft.com/en-us/library/ms536436(v=vs.85).aspx
    getData: (key: string) => string;
  };
}

export function seemToBeInIE(): boolean {
  return typeof ClipboardEvent === "undefined" &&
         typeof (window as IEWindow).clipboardData !== "undefined" &&
         typeof (window as IEWindow).clipboardData.setData !== "undefined";
}

export function writeIE(data: DT): boolean {
  // IE supports text or URL, but not HTML: https://msdn.microsoft.com/en-us/library/ms536744(v=vs.85).aspx
  // TODO: Write URLs to `text/uri-list`? https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
  const text = data.getData(TEXT_PLAIN);
  if (text !== undefined) {
    return (window as IEWindow).clipboardData.setData("Text", text);
  }

  throw new Error(("No `text/plain` value was specified."));
}

// Returns "" if the read failed, e.g. because the user rejected the permission.
export async function readIE(): Promise<string> {
  const text = (window as IEWindow).clipboardData.getData("Text");
  if (text === "") {
    throw new Error("Empty clipboard or could not read plain text from clipboard");
  }
  return text;
}
