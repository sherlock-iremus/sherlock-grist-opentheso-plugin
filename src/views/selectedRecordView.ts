import { configTableRecords, currentRecord, columns, thesauri } from "../state";
import { existingIndexationsList, selectedResourceLabel } from "./pluginHTMLElements";
import { handleDeleteIndexationButtonClick } from "../handlers";

export const displayNoResourceSelected = () => {
    selectedResourceLabel.textContent = "Pas de ressource sélectionnée";
    existingIndexationsList.innerHTML = "";
}

export const displaySelectedResourceLabel = () => {
    selectedResourceLabel.textContent = currentRecord.UUID || "";
}

export const displayNoExistingIndexations = () => {
    existingIndexationsList.innerHTML = "<div style='font-size:0.95em;'>Aucune indexation existante.</div>";
}

export const displayIndexationsByColumn = () => {
    const ul = document.createElement("ul");
    ul.style.paddingLeft = "1.2em";
    ul.style.margin = "0";

    let hasIndexations = false;

    configTableRecords.forEach(indexationColumnToDisplay => {
        const uriArray = currentRecord[indexationColumnToDisplay.uri]?.split(';').filter((uri: string) => uri.trim()) || [];
        const labelArray = currentRecord[indexationColumnToDisplay.label]?.split(';').filter((label: string) => label.trim()) || [];
        const columnConfiguration = configTableRecords.find(record => {
            return record.uri === indexationColumnToDisplay.uri;
        })
        
        hasIndexations = uriArray.length !== 0;
        //const thesaurus = thesauri.find(t => t.identifier === indexationColumnToDisplay.thesaurus);
        
        const li = document.createElement("li");
        li.className = "indexation-type-item";
        
        // Header avec label de la colonne et lien thésaurus
        const headerDiv = document.createElement("div");
        headerDiv.className = "indexation-type-line";
        
        const colSpan = document.createElement("span");
        colSpan.className = "indexation-type-label";
        colSpan.textContent = indexationColumnToDisplay.label + ("Thésaurus : " + (columnConfiguration?.thesaurus || "Non spécifié"));
        headerDiv.appendChild(colSpan);
        
        const link = document.createElement("a");
        link.href = columnConfiguration?.thesaurus || "#";
        link.target = "_blank";
        link.rel = "noopener";
        link.className = "thesaurus-link";
        link.style.marginLeft = "8px";
        link.innerHTML = `<img src="./up-right-from-square.svg" alt="Ouvrir thésaurus" style="width:14px;height:14px;" />`;
        headerDiv.appendChild(link);
        
        li.appendChild(headerDiv);
        
        // Concepts
        const conceptsDiv = document.createElement("div");
        conceptsDiv.className = "indexation-concept-line";
        
        uriArray.forEach((uri: string, index: number) => {
            const label = labelArray[index] || uri;
            console.log("afficher concept: " + uri);
            
            const conceptSpan = document.createElement("span");
            conceptSpan.className = "indexation-concept";
            
            const labelSpan = document.createElement("span");
            labelSpan.className = "indexation-concept-label";
            labelSpan.textContent = label;
            conceptSpan.appendChild(labelSpan);
            
            const link = document.createElement("a");
            link.href = uri;
            link.target = "_blank";
            link.rel = "noopener";
            link.className = "indexation-concept-link";
            link.innerHTML = `<img src="./up-right-from-square.svg" alt="Ouvrir" style="width:12px;height:12px;" />`;
            conceptSpan.appendChild(link);
            
            const deleteBtn = document.createElement("button");
            deleteBtn.title = "Supprimer";
            deleteBtn.className = "indexation-concept-delete";
            deleteBtn.innerHTML = `<svg width="15" height="15" fill="none" stroke="#b33" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="6" x2="19" y2="6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/><rect x="6" y="6" width="12" height="14" rx="2"/></svg>`;
            deleteBtn.onclick = () => handleDeleteIndexationButtonClick(uri, index, indexationColumnToDisplay.uri, indexationColumnToDisplay.label);
            conceptSpan.appendChild(deleteBtn);
            
            conceptsDiv.appendChild(conceptSpan);
            
            if (index < uriArray.length - 1) {
                const sep = document.createElement("span");
                sep.className = "indexation-concept-separator";
                sep.textContent = " ; ";
                conceptsDiv.appendChild(sep);
            }
        });
        
        li.appendChild(conceptsDiv);
        ul.appendChild(li);
    });

    if (!hasIndexations) {
        displayNoExistingIndexations();
    } else {
        existingIndexationsList.appendChild(ul);
    }
}