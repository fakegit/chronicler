// @flow

export const CHROME_MESSAGE = "CHROME_MESSAGE";

export type ChromeMessageData = {
  type: string,
  payload?: any,
};

export const CHROME_READY = "CHROME_READY";
export const CHROME_RESIZE = "CHROME_RESIZE";
export const NETWORK_MODE = "NETWORK_MODE";
export const SCRAPE_START = "SCRAPE_START";
export const SCRAPE_STOP = "SCRAPE_STOP";
export const SCRAPE_STATUS = "SCRAPE_STATUS";
export const TAB_UPDATE = "TAB_UPDATE";
export const TAB_FOCUS = "TAB_FOCUS";
export const TAB_NAVIGATE = "TAB_NAVIGATE";

export type ScrapeConfig = {
  // When scraping, only links to pages with URLs that start with one of these
  // will be followed. Additionally, if we happen to end up on a page outside of
  // a rootUrl, we won't examine its contents for more links.
  rootUrls: Array<string>,
  // All links returned by this xpath expression will be scraped.
  linkXpath: string,
  // Maximum number of pages per minute to load. This is different from
  // requests per minute, since all assets are still loaded as quickly as
  // possible after the page.
  ppmLimit: number,
};

export type ScrapeState = "initialized" | "running" | "finished" | "canceled";

export type ScrapeStatus = {
  state: ScrapeState,
  // Total number of pages visited in the current scrape
  pagesVisited: number,
  // Currently known number of pages remaining. This number will go up as new
  // pages are scraped.
  pagesRemaining: number,
  // Current average pages per minute
  ppm: number,
  // Configured maximum pages per minute
  ppmLimit: number,
};
