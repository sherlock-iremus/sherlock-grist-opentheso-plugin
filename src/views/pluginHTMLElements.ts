function getElementByIdOrThrow<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id "${id}" not found`);
  return el as T;
}

export const selectedRecordLabel = getElementByIdOrThrow<HTMLSpanElement>("selectedRecordLabel");
export const configWarningDiv = getElementByIdOrThrow<HTMLDivElement>("configWarningDiv");
export const configWarningList = getElementByIdOrThrow<HTMLUListElement>("configWarningList");
export const existingIndexationsList = getElementByIdOrThrow<HTMLDivElement>("existingIndexationsList");
export const searchResults = getElementByIdOrThrow<HTMLDivElement>("searchResults");
export const generateLabelsButton = getElementByIdOrThrow<HTMLImageElement>("generateLabelsButton");
export const contentDiv = getElementByIdOrThrow<HTMLDivElement>("content");