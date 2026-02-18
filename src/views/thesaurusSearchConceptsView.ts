import { conceptList, currentThesaurus, currentColumn, currentRecord } from "../state";
import { FormattedGristColumn } from "../types/FormattedGristColumn";
import { getBroaderIdForConcept, OpenthesoConcept } from "../types/OpenthesoConcept";
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
    li.style.justifyContent = "space-between";

    const label = getLabelForConcept(concept);
    const broaderId = getBroaderIdForConcept(concept);
    const conceptId = getConceptIdForConcept(concept);
    let idTheso = currentThesaurus.idTheso;

    // Left side: label with tooltip
    const labelContainer = document.createElement("div");
    labelContainer.style.flex = "1";
    
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

    // Right side: action button (+ or checkmark)
    const actionContainer = document.createElement("div");
    actionContainer.style.marginLeft = "12px";

    const isAlreadyIndexed = isConceptIndexed(conceptId);
    
    if (isAlreadyIndexed) {
        const checkmark = document.createElement("span");
        checkmark.textContent = "✓";
        checkmark.style.color = "green";
        checkmark.style.fontSize = "1.2em";
        checkmark.style.fontWeight = "bold";
        actionContainer.appendChild(checkmark);
    } else {
        const addBtn = document.createElement("button");
        addBtn.textContent = "+";
        addBtn.className = "concept-add-btn";
        addBtn.style.padding = "4px 8px";
        addBtn.style.cursor = "pointer";
        addBtn.title = "Ajouter ce concept";
        addBtn.onclick = (ev) => {
            ev.stopPropagation();
            // TODO: Handle add action
        };
        actionContainer.appendChild(addBtn);
    }

    li.appendChild(actionContainer);
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

/*const getIndexableLabelColumnsForConcept = (conceptId: string): FormattedGristColumn[] => {
    return columns
        .filter(c => c.id.endsWith(LABEL_COLUMN_SUFFIX))
        .filter(c => !indexations[c.id.replace(LABEL_COLUMN_SUFFIX, '')]?.some(item => item.uri_concept === conceptId));
}

const getAlreadyIndexedLabelColumns = (conceptId: string): FormattedGristColumn[] => {
    return columns
        .filter(c => c.id.endsWith(LABEL_COLUMN_SUFFIX))
        .filter(c => indexations[c.id.replace(LABEL_COLUMN_SUFFIX, '')]?.some(item => item.uri_concept === conceptId));
}*/

const getOptionForColumn = (col: FormattedGristColumn) => {
    const opt = document.createElement("option");
    opt.value = col.id;
    opt.textContent = col.label;
    return opt;
}

/*const getActionCellForConcept = (conceptId: string, label: string) => {
    const labelColumnsIndexable = getIndexableLabelColumnsForConcept(conceptId);
    const alreadyIndexedLabelColumns = getAlreadyIndexedLabelColumns(conceptId);

    const select = document.createElement("select");
    select.className = "concepts-select";
    select.innerHTML = `<option value="">Sélectionner...</option>`;
    labelColumnsIndexable.forEach(col => {
        select.appendChild(getOptionForColumn(col));
    });

    select.addEventListener("change", () => {
        handleSelectOptionChange(conceptId, label, select.value);
    });


    const plural = alreadyIndexedLabelColumns.length > 1 ? 's' : ''
    const infoDiv = document.createElement("div");
    infoDiv.className = "concepts-info";
    infoDiv.textContent = `${alreadyIndexedLabelColumns.length} colonne${plural} sélectionnée${plural}.`


    const actionCell = document.createElement("td");
    actionCell.className = "concepts-action-cell";
    actionCell.appendChild(select);
    actionCell.appendChild(infoDiv);
    return actionCell;
}

const getConceptLabelCell = (conceptId: string, label: string) => {
    const labelCell = document.createElement("td");
    labelCell.className = "concepts-label-cell";
    labelCell.innerHTML = `${label} <a href="${conceptId}" target="_blank" rel="noopener"><img src="./up-right-from-square.svg"/></a>`;
    return labelCell;
}*/

