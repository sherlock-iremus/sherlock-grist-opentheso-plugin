import { ConfigurationTableData } from "./types/ConfigurationTableData";
import { FormattedGristColumn } from "./types/FormattedGristColumn";
import { GristRecord } from "./types/GristRecord";
import { GristTable } from "./types/GristTable";
import { OpenthesoConcept } from "./types/OpenthesoConcept";
import { Thesaurus } from "./types/Thesaurus";

export let gristTable: GristTable;
export let thesauri: Thesaurus[];
export let currentThesaurus: Thesaurus;
export let conceptList: OpenthesoConcept[];
export let columns: FormattedGristColumn[];
export let currentRecord: GristRecord;
export let configTable: ConfigurationTableData;
export let technicalTableId: string;
export let configTableRecords: FormattedConfigurationTableRecord[];
export let currentColumn: FormattedConfigurationTableRecord;

export const setConfigTableRecords = (newConfigTableRecords: FormattedConfigurationTableRecord[]) => {
    configTableRecords = newConfigTableRecords;
}

export const setConfigTable = (newConfigTable: ConfigurationTableData) => {
    configTable = newConfigTable;
}

export const setTechnicalTableId = (tableId: string) => {
    technicalTableId = tableId;
}

export const setGristTable = (table: GristTable) => {
    gristTable = table;
}

export const setThesauri = (newThesauri: Thesaurus[]) => {
    thesauri = newThesauri;
}

export const setcurrentThesaurus = (newThesaurus: Thesaurus) => {
    currentThesaurus = newThesaurus;
}

export const setConceptList = (newConceptList: OpenthesoConcept[]) => {
    conceptList = newConceptList;
}

export const setColumns = (newColumns: FormattedGristColumn[]) => {
    columns = newColumns;
}

export const setCurrentRecord = (record: GristRecord) => {
    currentRecord = record;
}

export const setCurrentColumn = (formattedConfigurationTableRecord: FormattedConfigurationTableRecord) => {
    currentColumn = formattedConfigurationTableRecord;
}