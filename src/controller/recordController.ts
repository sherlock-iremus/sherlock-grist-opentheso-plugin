import { upsertGristRecordApiCall } from "../api/grist";
import { currentRecord } from "../state";
import { displayIndexationsByColumn, displayNoRecordSelected, displaySelectedRecordLabel } from "../views/selectedRecordView";
import { displaySearchResults } from "../views/thesaurusSearchConceptsView";

export const renderSelectedRecord = () => {
    if (!currentRecord) {
        displayNoRecordSelected();
        return;
    }

    displaySelectedRecordLabel();
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
        [uriColumnId]: (currentRecord[uriColumnId] ? currentRecord[uriColumnId].split(';') : [])
            .concat([conceptId])
            .join(';'),
        [labelColumnId]: (currentRecord[labelColumnId] ? currentRecord[labelColumnId].split(';') : [])
            .concat([label])
            .join(';')
    }, { id: currentRecord.id })
}

export const updateRecordColumn = (record: Partial<typeof currentRecord>, id: number) => {
    upsertGristRecordApiCall(record, { id: id })
}