import { handleAddConceptClick } from "../handlers";
import { conceptList, currentThesaurus, currentColumn, currentRecord } from "../state";
import { OpenthesoConcept } from "../types/OpenthesoConcept";
import { searchResults, selectedThesaurusLabel } from "./pluginHTMLElements";

// Display french label of the thesaurus if it exists, otherwise show the id. In an a Element linked to thesaurus on opentheso
export const displayThesaurusSelected = () => {
    const thesaurusSpan = document.createElement("span");

    const labelSpan = document.createElement("span");
    labelSpan.textContent = `${currentThesaurus.labels.find(l => l.lang === "fr")?.title || currentThesaurus.idTheso}`;
    thesaurusSpan.appendChild(labelSpan);

    const link = document.createElement("a");
    link.href = `https://opentheso.huma-num.fr/?idt=${currentThesaurus.idTheso}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.innerHTML = `<img src="./up-right-from-square.svg" alt="Ouvrir" style="width:12px;height:12px;" />`;
    thesaurusSpan.appendChild(link);
    selectedThesaurusLabel.innerHTML = thesaurusSpan.innerHTML;
}
export const displayLoading = () => {
    searchResults.innerHTML = "Recherche...";
}

export const displayError = (error: string) => {
    searchResults.innerHTML = error;
}

export const displaySearchResults = () => {
    if (!Array.isArray(conceptList) || conceptList.length === 0) {
        searchResults.innerHTML = "Aucun résultat.";
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
    li.style.padding = "8px";
    li.style.borderBottom = "1px solid #e0e0e0";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "flex-start";
    li.style.gap = "8px";

    const label = getLabelForConcept(concept);
    const conceptId = getConceptIdForConcept(concept);

    const actionContainer = document.createElement("div");
    actionContainer.style.flexShrink = "0";

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
    
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    labelSpan.style.cursor = "pointer";
    
    // Add tooltip with broaderLabel if it exists
    if (concept.broaderLabel) {
        labelSpan.title = `Terme plus générique: ${concept.broaderLabel}`;
        labelSpan.style.textDecoration = "underline";
        labelSpan.style.textDecorationStyle = "dotted";
    }
    
    labelContainer.appendChild(labelSpan);
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