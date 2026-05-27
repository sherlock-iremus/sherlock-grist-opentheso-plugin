import { upsertGristRecordApiCall } from "../api/grist";
import { currentRecord } from "../state";
import { CONCEPT_SEPARATOR } from "../utils/consts";
import { displayIndexationsByColumn, displayNoRecordSelected } from "../views/selectedRecordView";
import { displaySearchResults } from "../views/thesaurusSearchConceptsView";

export const renderSelectedRecord = () => {
    if (!currentRecord) {
        displayNoRecordSelected();
        return;
    }

    displayIndexationsByColumn();
    displaySearchResults();
}


export const removeConceptFromColumn = (conceptIndex: number, uriColumnId: string, labelColumnId: string) => {

    const urisArray = currentRecord[uriColumnId].split(CONCEPT_SEPARATOR.trim()).map((uri: string) => uri.trim()).filter((uri: string) => uri.length > 0);
    urisArray.splice(conceptIndex, 1);
    const newUrisString = urisArray.join(CONCEPT_SEPARATOR);

    const labelsArray = currentRecord[labelColumnId].split(CONCEPT_SEPARATOR.trim()).map((label: string) => label.trim()).filter((label: string) => label.length > 0);
    labelsArray.splice(conceptIndex, 1);
    const newLabelsString = labelsArray.join(CONCEPT_SEPARATOR);

    upsertGristRecordApiCall({
        [uriColumnId]: newUrisString,
        [labelColumnId]: newLabelsString
    }, { id: currentRecord.id })
}

export const addConceptToColumn = (conceptId: string, label: string, uriColumnId: string, labelColumnId: string) => {
    upsertGristRecordApiCall({
        [uriColumnId]: (currentRecord[uriColumnId] ? currentRecord[uriColumnId].split(CONCEPT_SEPARATOR.trim()).map((uri: string) => uri.trim()).filter((uri: string) => uri.length > 0) : [])
            .concat([conceptId])
            .join(CONCEPT_SEPARATOR),
        [labelColumnId]: (currentRecord[labelColumnId] ? currentRecord[labelColumnId].split(CONCEPT_SEPARATOR.trim()).map((label: string) => label.trim()).filter((label: string) => label.length > 0) : [])
            .concat([label])
            .join(CONCEPT_SEPARATOR)
    }, { id: currentRecord.id })
}

export const updateRecordColumn = (record: Partial<typeof currentRecord>, id: number) => {
    upsertGristRecordApiCall(record, { id: id })
}