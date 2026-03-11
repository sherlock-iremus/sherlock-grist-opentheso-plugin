import { configTableRecords, currentRecord, columns, thesauri, currentThesaurus } from "../state";
import { existingIndexationsList, selectedRecordLabel } from "./pluginHTMLElements";
import { handleDeleteIndexationButtonClick, handleIndexationTypeChosen, handleSearchInputKeydown } from "../handlers";
import { Thesaurus } from "../types/Thesaurus";

export const displayNoRecordSelected = () => {
    selectedRecordLabel.textContent = "Pas de ligne sélectionnée";
    existingIndexationsList.innerHTML = "";
}

export const displaySelectedRecordLabel = () => {
    selectedRecordLabel.textContent = currentRecord?.id ? "n°" + currentRecord?.id : "aucune";
}

export const displayNoExistingIndexations = () => {
    existingIndexationsList.innerHTML = "<div style='font-size:0.95em;'>Aucune indexation existante.</div>";
}

export const displayIndexationsByColumn = () => {

    const table = document.createElement("table");
    table.className = "indexation-table";

    configTableRecords.forEach(indexationColumnToDisplay => {

        const uriArray = currentRecord[indexationColumnToDisplay.uri]?.split(';').filter((uri: string) => uri.trim()) || [];
        const labelArray = currentRecord[indexationColumnToDisplay.label]?.split(';').filter((label: string) => label.trim()) || [];

        const indexationTypeLabel =
            columns.find(col => col.id === indexationColumnToDisplay.label)?.label
            || indexationColumnToDisplay.uri;

        const thesaurusId =
            (new URL(indexationColumnToDisplay.thesaurus)).searchParams.get("idt");

        const thesaurus = thesauri.find(t => t.idTheso === thesaurusId);

        if (!thesaurus) {
            console.error("Thesaurus not found :", indexationColumnToDisplay);
            return;
        }

        const thesaurusName =
            thesaurus?.labels.find(l => l.lang === "fr")?.title;

        // -----------------------------
        // HEADER ROW
        // -----------------------------

        const headerRow = document.createElement("tr");
        headerRow.className = "indexation-type-header";

        const headerCell = document.createElement("td");
        headerCell.colSpan = 2;

        const headerDiv = document.createElement("div");
        headerDiv.className = "indexation-type-line";

        const labelSpan = document.createElement("span");
        labelSpan.textContent =
            indexationTypeLabel +
            " (" +
            (thesaurusName || "Thésaurus non trouvé") +
            ")";

        const link = document.createElement("a");
        link.href = indexationColumnToDisplay.thesaurus;
        link.target = "_blank";
        link.rel = "noopener";
        link.style.marginLeft = "8px";
        link.innerHTML =
            `<img src="./up-right-from-square.svg" style="width:14px;height:14px;" />`;

        headerDiv.appendChild(labelSpan);
        headerDiv.appendChild(link);

        headerCell.appendChild(headerDiv);
        headerRow.appendChild(headerCell);

        table.appendChild(headerRow);

        // -----------------------------
        // CONCEPT ROWS
        // -----------------------------

        uriArray.forEach((uri: string, index: number) => {

            const row = getConceptRow(
                labelArray,
                indexationColumnToDisplay,
                uri,
                index
            );

            table.appendChild(row);
        });

        // -----------------------------
        // CONTROLS ROW
        // -----------------------------

        const controlsRow = document.createElement("tr");
        const controlsCell = document.createElement("td");
        controlsCell.colSpan = 2;

        const isColumnCurrentlyEdited =
            !!currentThesaurus && currentThesaurus.idTheso === thesaurusId;

        if (isColumnCurrentlyEdited) {
            controlsCell.appendChild(getIndexationColumnSearchBar());
        } else {
            controlsCell.appendChild(
                getAddConceptButton(thesaurus, indexationColumnToDisplay)
            );
        }

        controlsRow.appendChild(controlsCell);
        table.appendChild(controlsRow);
    });

    existingIndexationsList.replaceChildren(table);
};

const getAddConceptButton = (thesaurus: Thesaurus, indexationColumnToDisplay: FormattedConfigurationTableRecord) => {
    const addBtn = document.createElement("button");
    addBtn.className = "indexation-add-btn add-btn";
    addBtn.title = "Sélectionner ce thésaurus";
    addBtn.textContent = "+";
    addBtn.onclick = (ev) => {
        ev.stopPropagation();
        handleIndexationTypeChosen(indexationColumnToDisplay, thesaurus);
    };
    return addBtn;
}

const getIndexationColumnSearchBar = () => {
    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "Rechercher un concept...";
    searchInput.className = "indexation-search";

    searchInput.onkeydown = (e: KeyboardEvent) => handleSearchInputKeydown(e, searchInput.value);
    setTimeout(() => searchInput.focus(), 0);

    return searchInput;
}

const getConceptRow = (
    labelArray: string[],
    indexationColumnToDisplay: FormattedConfigurationTableRecord,
    uri: string,
    index: number
) => {

    const label = labelArray[index] || uri;

    const tr = document.createElement("tr");
    tr.className = "indexation-concept-row";

    // -----------------------------
    // CONCEPT CELL
    // -----------------------------

    const conceptTd = document.createElement("td");

    const link = document.createElement("a");
    link.href = uri;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = label;

    conceptTd.appendChild(link);

    tr.appendChild(conceptTd);

    // -----------------------------
    // DELETE CELL
    // -----------------------------

    const deleteTd = document.createElement("td");

    const deleteBtn = document.createElement("button");
    deleteBtn.title = "Supprimer";
    deleteBtn.className = "indexation-concept-delete";

    deleteBtn.innerHTML = `
        <svg width="15" height="15" fill="none" stroke="#b33" stroke-width="2" viewBox="0 0 24 24">
            <line x1="5" y1="6" x2="19" y2="6"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
            <rect x="6" y="6" width="12" height="14" rx="2"/>
        </svg>
    `;

    deleteBtn.onclick = () =>
        handleDeleteIndexationButtonClick(
            uri,
            index,
            indexationColumnToDisplay.uri,
            indexationColumnToDisplay.label
        );

    deleteTd.appendChild(deleteBtn);

    tr.appendChild(deleteTd);

    return tr;
};