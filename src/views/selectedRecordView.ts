import { configTableRecords, currentRecord, columns, thesauri, currentColumn } from "../state";
import { existingIndexationsList, selectedRecordLabel } from "./pluginHTMLElements";
import { handleDeleteIndexationButtonClick, handleIndexationTypeChosen, handleSearchInputKeydown } from "../handlers";
import { Thesaurus } from "../types/Thesaurus";
import { externalLinkImageHtml } from "./thesaurusSearchConceptsView";
import { getAddButtonElement, trashcanIconClass } from "./components/icons";

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

        const thesaurusLabelLink = document.createElement("a");
        thesaurusLabelLink.href = indexationColumnToDisplay.thesaurus;
        thesaurusLabelLink.target = "_blank";
        thesaurusLabelLink.rel = "noopener";
        thesaurusLabelLink.style.color = "inherit";
        thesaurusLabelLink.style.textDecoration = "none";
        thesaurusLabelLink.style.cursor = "pointer";
        thesaurusLabelLink.innerHTML =
            `${indexationTypeLabel} (${thesaurusName || "Thésaurus non trouvé"}) <img src="./up-right-from-square.svg" style="width:14px;height:14px;margin-left:8px;vertical-align:middle;" />`;

        headerDiv.appendChild(thesaurusLabelLink);

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

        const isColumnCurrentlyEdited = indexationColumnToDisplay.id === currentColumn?.id

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
    const addBtn = getAddButtonElement()
    addBtn.className = addBtn.className + " indexation-add-btn";
    addBtn.title = "Sélectionner ce thésaurus";
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

    const labelLink = document.createElement("a");
    labelLink.innerHTML = `${label} ${externalLinkImageHtml}`;
    labelLink.style.cursor = "pointer";
    labelLink.style.color = "inherit";
    labelLink.style.textDecoration = "none";
    labelLink.href = uri;
    labelLink.target = "_blank";
    labelLink.rel = "noopener";

    conceptTd.appendChild(labelLink);

    tr.appendChild(conceptTd);

    // -----------------------------
    // DELETE CELL
    // -----------------------------

    const deleteTd = document.createElement("td");


    const deleteBtn = document.createElement("button");
    deleteBtn.title = "Supprimer";
    deleteBtn.className = "indexation-concept-delete";
    deleteBtn.innerHTML = `<i class="${trashcanIconClass}"></i>`;

    deleteBtn.onclick = () => {
        const confirmDelete = window.confirm(`Voulez-vous désindexer le concept ${label} ?`);
        if (confirmDelete) {
            handleDeleteIndexationButtonClick(
                uri,
                index,
                indexationColumnToDisplay.uri,
                indexationColumnToDisplay.label
            );
        }
    };

    deleteTd.appendChild(deleteBtn);

    tr.appendChild(deleteTd);

    return tr;
};