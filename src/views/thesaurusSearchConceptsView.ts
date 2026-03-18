import { handleAddConceptClick } from "../handlers";
import { conceptList, currentColumn, currentRecord, searchQuery } from "../state";
import { OpenthesoConcept } from "../types/OpenthesoConcept";
import { searchResults } from "./pluginHTMLElements";

// Display french label of the thesaurus if it exists, otherwise show the id. In an a Element linked to thesaurus on opentheso
export const externalLinkImageHtml = "<img src='./up-right-from-square.svg' alt='Ouvrir' style='width:12px;height:12px;' />";

export const displayLoading = () => {
    searchResults.innerHTML = "Recherche...";
}

export const displayError = (error: string) => {
    searchResults.innerHTML = error;
}

export const displaySearchResults = () => {
    if (searchQuery.trim() === "") {
        searchResults.innerHTML = "Saisir votre recherche."; 
        return;
    } else if (conceptList.length === 0) {
        searchResults.innerHTML = `Aucun résultat contenant "${searchQuery}".`;
        return;
    }

    const ul = document.createElement("ul");
    ul.className = "search-results-list";
    ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.margin = "0";

    conceptList.forEach(concept => {
        ul.appendChild(getLineForConcept(concept));
    });

    searchResults.innerHTML = "";
    searchResults.appendChild(ul);
}

const getLineForConcept = (concept: OpenthesoConcept) => {
    const li = document.createElement("li");
    li.className = "search-result-item";

    const label = getLabelForConcept(concept);
    const conceptId = getConceptIdForConcept(concept);

    const actionContainer = document.createElement("div");
    actionContainer.className = "action-container-div";

    const isAlreadyIndexed = isConceptIndexed(conceptId);
    
    if (isAlreadyIndexed) {
        const checkmark = document.createElement("span");
        checkmark.textContent = "✓";
        checkmark.style.color = "#1DA270";
        checkmark.style.fontSize = "1.2em";
        checkmark.style.fontWeight = "bold";
        actionContainer.appendChild(checkmark);
    } else {
        const addBtn = document.createElement("button");
        addBtn.textContent = "+";
        addBtn.className = "add-btn";
        addBtn.style.padding = "4px 8px";
        addBtn.style.cursor = "pointer";
        addBtn.title = "Ajouter ce concept";
        addBtn.onclick = (ev) => {
            ev.stopPropagation();
            handleAddConceptClick(conceptId, label, currentColumn.uri, currentColumn.label);
        };
        actionContainer.appendChild(addBtn);
    }

    li.appendChild(actionContainer);

    const labelContainer = document.createElement("div");
    labelContainer.style.flex = "1";
    labelContainer.style.minWidth = "0";
    
    const labelLink = document.createElement("a");
    labelLink.innerHTML = `${label} ${externalLinkImageHtml}`;
    labelLink.style.cursor = "pointer";
    labelLink.style.color = "inherit";
    labelLink.style.textDecoration = "none";
    labelLink.href = conceptId;
    labelLink.target = "_blank";
    labelLink.rel = "noopener";
    
    labelContainer.appendChild(labelLink);
    li.appendChild(labelContainer);

    return li;
}

const getLabelForConcept = (concept: OpenthesoConcept) => {
    return concept["http://www.w3.org/2004/02/skos/core#prefLabel"]?.find(l => l["@language"] === "fr")?.["@value"] || "(Sans label)";
}

const getConceptIdForConcept = (concept: OpenthesoConcept) => {
    return "https://opentheso.huma-num.fr" + concept["@id"].split('/').pop();
}

const isConceptIndexed = (conceptId: string): boolean => {
    if (!currentColumn || !currentRecord) {
        return false;
    }

    const uriArray = currentRecord[currentColumn.uri]?.split(';').filter((uri: string) => uri.trim()) || [];
    return uriArray.some((uri: string) => uri.trim() === conceptId);
}