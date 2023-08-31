export const adaToCurrency = (ada: number): string =>
  `₳ ${ada.toLocaleString(navigator.language || "en-US")}`;
