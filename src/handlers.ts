/**
 * All handlers are centralized here. 
 * Each handler calls the appropriate controller function.
 * 
 * The handler is the only part of the code that has access to the state.
 * The handler is the only part of the code that has access to the controllers
 */

import { displayErrorsIfAnyConfigurationColumnMissing, fetchTableColumns, getConfigTableAsRecords } from "./controller/gristController";
import { addConceptToColumn, removeConceptFromColumn, renderSelectedRecord } from "./controller/recordController";
import { initializeAndFetchThesauri, renderSearchResults, renderSelectedIndexationType, searchConcepts } from "./controller/thesaurusController";
import { gristTable, setColumns, setConceptList, setConfigTable, setConfigTableRecords, setCurrentColumn, setCurrentRecord, setcurrentThesaurus, setGristTable, setThesauri, technicalTableId } from "./state";
import { GristRecord } from "./types/GristRecord";
import { OpenthesoConcept } from "./types/OpenthesoConcept";
import { Thesaurus } from "./types/Thesaurus";

export const handleNewRecord = (record: GristRecord) => {
    console.log("New record selected:", record);
    setCurrentRecord(record);
    renderSelectedRecord();
}

/**
 * 
 * @param index position of concept in list of concepts column. 
 * @param uriColId id of the URI column storing this concept
 * @param labelColId id of the label column storing this concept
 */
export const handleDeleteIndexationButtonClick = (concept: string, index: number, uriColId: string, labelColId: string) => {
    console.log("Removing concept: ", concept);
    removeConceptFromColumn(index, uriColId, labelColId);
}

export const handleAddConceptClick = (conceptId: string, label: string, uriColId: string, labelColId: string) => {
    console.log("Add concept to column", uriColId, conceptId, label);
    addConceptToColumn(conceptId, label, uriColId, labelColId);
}

export const handlePluginInitialization = async () => {
    initializeAndFetchThesauri();
    
    grist.ready({ requiredAccess: "full" });
    setGristTable(await grist.getTable());
    setColumns(await fetchTableColumns(gristTable))
    setConfigTable(await grist.docApi.fetchTable("CONFIG"))
    //await grist.docApi.fetchTable(technicalTableId) // Fetch table aim the onRecord on the fetched table
    setConfigTableRecords(getConfigTableAsRecords());
    displayErrorsIfAnyConfigurationColumnMissing();
    
    grist.onRecord((record: GristRecord) => {
        handleNewRecord(record);
    });

}

export const handleIndexationTypeChosen = (indexationColumnToDisplay: FormattedConfigurationTableRecord, thesaurus: Thesaurus) => {
    console.log("Indexation type chosen:", indexationColumnToDisplay);
    setCurrentColumn(indexationColumnToDisplay);
    setcurrentThesaurus(thesaurus);
    renderSelectedIndexationType();
    renderSelectedRecord();
}

export const handleSearchInputKeydown = (e: KeyboardEvent, query: string) => {
    console.log("Searching concepts with query:", query);
    if (e.key === "Enter") searchConcepts(query);
}

export const handleThesauriFetched = (fetchedThesauri: Thesaurus[]) => {
    console.log("Thesauri fetched used to display thesauri labels :", fetchedThesauri);
    setThesauri(fetchedThesauri);
}

export const handleSearchConceptsFetched = (concepts: OpenthesoConcept[]) => {
    console.log("Concepts fetched with search:", concepts);
    setConceptList(concepts);
    renderSearchResults();
}