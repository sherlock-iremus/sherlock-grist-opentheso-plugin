import { upsertGristRecordApiCall } from "../api/grist";
import { currentRecord } from "../state";
import { displayIndexationsByColumn, displayNoResourceSelected, displaySelectedResourceLabel } from "../views/selectedRecordView";
import { displaySearchResults } from "../views/thesaurusSearchConceptsView";

export const renderSelectedRecord = () => {
    if (!currentRecord) {
        displayNoResourceSelected();
        return;
    }

    displaySelectedResourceLabel();
    displayIndexationsByColumn();
    displaySearchResults();
}


export const removeConceptFromColumn = (conceptIndex: number, uriColumnId: string, labelColumnId: string) => {

    const urisArray = currentRecord[uriColumnId].split(';');
    urisArray.splice(conceptIndex, 1);
    const newUrisString = urisArray.join(';');
    
    const labelsArray = currentRecord[labelColumnId].split(';');
    labelsArray.splice(conceptIndex, 1);
    const newLabelsString = labelsArray.join(';');

    upsertGristRecordApiCall({
        [uriColumnId]: newUrisString,
        [labelColumnId]: newLabelsString
    }, { id: currentRecord.id })
}

export const addConceptToColumn = (conceptId: string, label: string, uriColumnId: string, labelColumnId: string) => {
    upsertGristRecordApiCall({
        [uriColumnId]: currentRecord[uriColumnId] + ';' + conceptId,
        [labelColumnId]: currentRecord[labelColumnId] + ';' + label
    }, { id: currentRecord.id })
}