import { configTableRecords, currentRecord, columns, thesauri, setCurrentColumn, currentThesaurus, setcurrentThesaurus } from "../state";
import { existingIndexationsList, selectedResourceLabel } from "./pluginHTMLElements";
import { handleDeleteIndexationButtonClick, handleIndexationTypeChosen } from "../handlers";

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

    configTableRecords.forEach(indexationColumnToDisplay => {
        const uriArray = currentRecord[indexationColumnToDisplay.uri]?.split(';').filter((uri: string) => uri.trim()) || [];
        const labelArray = currentRecord[indexationColumnToDisplay.label]?.split(';').filter((label: string) => label.trim()) || [];
        const indexationTypeLabel = columns.find(col => col.id === indexationColumnToDisplay.label)?.label || indexationColumnToDisplay.uri;
        const thesaurusId = (new URL(indexationColumnToDisplay.thesaurus)).searchParams.get("idt");

        const thesaurus = thesauri.find(t => t.idTheso === thesaurusId);

        if (!thesaurus) {
            console.error("Thesaurus not found :", indexationColumnToDisplay);
            return;
        }
        
        const thesaurusName = thesaurus?.labels.find(l => l.lang === "fr")?.title;
        const li = document.createElement("li");
        li.className = "indexation-type-item";

        // Header avec label de la colonne et lien thésaurus
        const headerDiv = document.createElement("div");
        headerDiv.className = "indexation-type-line";

        const colSpan = document.createElement("span");
        colSpan.className = "indexation-type-label";
        colSpan.textContent = indexationTypeLabel + '(' + (thesaurusName || "Thésaurus non trouvé") + ')';
        headerDiv.appendChild(colSpan);

        const link = document.createElement("a");
        link.href = indexationColumnToDisplay.thesaurus;
        link.target = "_blank";
        link.rel = "noopener";
        link.className = "thesaurus-link";
        link.style.marginLeft = "8px";
        link.innerHTML = `<img src="./up-right-from-square.svg" alt="Ouvrir thésaurus" style="width:14px;height:14px;" />`;
        headerDiv.appendChild(link);

        li.appendChild(headerDiv);

        // Concepts as a vertical list
        const conceptsDiv = document.createElement("div");
        conceptsDiv.className = "indexation-concept-line";

        const conceptsUl = document.createElement("ul");
        conceptsUl.className = "indexation-concepts-list";

        uriArray.forEach((uri: string, index: number) => {
            const label = labelArray[index] || uri;

            const li = document.createElement("li");
            li.className = "indexation-concept-item";

            const labelSpan = document.createElement("span");
            labelSpan.className = "indexation-concept-label";
            labelSpan.textContent = label;
            li.appendChild(labelSpan);

            const link = document.createElement("a");
            link.href = uri;
            link.target = "_blank";
            link.rel = "noopener";
            link.className = "indexation-concept-link";
            link.innerHTML = `<img src="./up-right-from-square.svg" alt="Ouvrir" style="width:12px;height:12px;" />`;
            li.appendChild(link);

            const deleteBtn = document.createElement("button");
            deleteBtn.title = "Supprimer";
            deleteBtn.className = "indexation-concept-delete";
            deleteBtn.innerHTML = `<svg width="15" height="15" fill="none" stroke="#b33" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="6" x2="19" y2="6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/><rect x="6" y="6" width="12" height="14" rx="2"/></svg>`;
            deleteBtn.onclick = () => handleDeleteIndexationButtonClick(uri, index, indexationColumnToDisplay.uri, indexationColumnToDisplay.label);
            li.appendChild(deleteBtn);

            conceptsUl.appendChild(li);
        });

        // Controls: search bar if current thesaurus matches, otherwise + button
        const controlsLi = document.createElement("li");
        controlsLi.className = "indexation-concept-item controls-item";

        const thesaurusMatches = !!currentThesaurus && (currentThesaurus.idTheso === thesaurusId);

        if (thesaurusMatches) {
            const searchInput = document.createElement("input");
            searchInput.type = "search";
            searchInput.placeholder = "Rechercher un concept...";
            searchInput.className = "indexation-search";
            controlsLi.appendChild(searchInput);
        } else {
            const addBtn = document.createElement("button");
            addBtn.className = "indexation-add-btn";
            addBtn.title = "Sélectionner ce thésaurus";
            addBtn.textContent = "+";
            addBtn.onclick = (ev) => {
                ev.stopPropagation();
                setcurrentThesaurus(thesaurus);
                setCurrentColumn(indexationColumnToDisplay);
                handleIndexationTypeChosen(indexationColumnToDisplay, thesaurus);
            };
            controlsLi.appendChild(addBtn);
        }

        conceptsUl.appendChild(controlsLi);
        conceptsDiv.appendChild(conceptsUl);

        li.addEventListener('click', () => {
            handleIndexationTypeChosen(indexationColumnToDisplay, thesaurus);
        });

        li.appendChild(conceptsDiv);
        ul.appendChild(li);


    });
    existingIndexationsList.replaceChildren(ul);
}