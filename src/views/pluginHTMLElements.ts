function getElementByIdOrThrow<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id "${id}" not found`);
  return el as T;
}

export const selectedResourceLabel = getElementByIdOrThrow<HTMLSpanElement>("selectedResourceLabel");
export const pluginConfigurationDiv = getElementByIdOrThrow<HTMLDivElement>("configWarning");
export const existingIndexationsList = getElementByIdOrThrow<HTMLDivElement>("existingIndexationsList");
export const selectedThesaurusLabel = getElementByIdOrThrow<HTMLSpanElement>("selectedThesaurusLabel");
export const thesaurusLink = getElementByIdOrThrow<HTMLAnchorElement>("thesaurusLink");
export const searchResults = getElementByIdOrThrow<HTMLDivElement>("searchResults");