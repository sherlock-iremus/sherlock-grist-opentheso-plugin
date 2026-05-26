import { columns, configTable, configTableRecords, setTechnicalTableId, technicalTableId } from "../state";
import { FormattedGristColumn } from "../types/FormattedGristColumn";
import { GristTablesColumns } from "../types/grist";
import { GristTable } from "../types/GristTable";
import { indexesOf } from "../utils/indexesOf";
import { displayColumnsMissing, displayConfigurationOK, displayMalformedConfigurationTable } from "../views/pluginConfigurationView";

/**
 * Plugin initialization, get all columns of the current table.
 * 
 * There is only one way to get current table LABELS.
 * It is to fetch the special _grist_Tables and _grist_Tables_column tables from the docApi,
 * and then to match the column parentId to the current table id.
 * 
 * @param gristTable grist table api object
 * @returns all columns of the current table with their id and label 
 */
export const fetchTableColumns = async (gristTable: GristTable): Promise<FormattedGristColumn[]> => {
    // All columns from your workspace
    const gristTableColumns = await grist.docApi.fetchTable("_grist_Tables_column")
    console.log("gristTableColumns : ", gristTableColumns)

    // All columns from current table
    const currentTableColumnsIds = await fetchCurrentTableColumnsFromDocApi(gristTable, gristTableColumns)
    console.log("currentTableColumnsIds : ", currentTableColumnsIds)

    // We also have to filter out columns that are not in the current table view, such as "sortBy, filterBy, etc."
    // We can do so since those columns are not included in from grist.fetchSelectedTable().
    const directlyFetchedTableColumns = Object.keys(await grist.fetchSelectedTable({ format: "columns" }));
    console.log("directlyFetchedTableColumns : ", directlyFetchedTableColumns)

    return currentTableColumnsIds
        .filter(idx => directlyFetchedTableColumns.includes(gristTableColumns.colId[idx]))
        .map(idx => ({ id: gristTableColumns.colId[idx], label: gristTableColumns.label[idx] }))
}

export const fetchCurrentTableRecordIds = async () => {
    const fetchedRecords = await grist.fetchSelectedTable({ format: "records" });
    return fetchedRecords.id;
}

const fetchCurrentTableColumnsFromDocApi = async (gristTable: GristTable, gristTableColumns: GristTablesColumns) => {
    setTechnicalTableId(await gristTable.getTableId());
    console.log("technicalTableId : ", technicalTableId)

    const gristTables = await grist.docApi.fetchTable("_grist_Tables")
    const currentTableIndex = gristTables.tableId.indexOf(technicalTableId);
    const currentTableId = gristTables.id[currentTableIndex]
    console.log("gristTableId : ", currentTableId)


    const currentTableColumnsIds = [];

    let index = gristTableColumns.parentId.indexOf(currentTableId);
    while (index !== -1) {
        currentTableColumnsIds.push(index);
        index = gristTableColumns.parentId.indexOf(currentTableId, index + 1);
    }
    return currentTableColumnsIds;
}

export const displayErrorsIfAnyConfigurationColumnMissing = () => {
    console.log("Checking for missing configuration columns...");
    console.log("configTableRecords : ", configTableRecords);
    console.log("currentTableFormattedColumns : ", columns);

    const uriColumnMissingList = configTableRecords.filter(record => {
        return !columns.some(col => col.id === record.Descripteur_IDCN);
    });

    const labelColumnMissingList = configTableRecords.filter(record => {
        return !columns.some(col => col.id === record.Descripteur_PLCN);
    });

    if (configTableRecords.some(record => Object.values(record).some(value => value === null || value === undefined || value === ""))) {
        console.warn("Some configuration fields are empty : ", configTableRecords);
        displayMalformedConfigurationTable();
    } else if (uriColumnMissingList.length || labelColumnMissingList.length) {
        console.warn("Some URI | label columns are missing : ", uriColumnMissingList, labelColumnMissingList);
        displayColumnsMissing(labelColumnMissingList, uriColumnMissingList);
    } else {
        displayConfigurationOK();
    }
}

export const getConfigTableAsRecords = (): FormattedConfigurationTableRecord[] => {
    const indexes: number[] = indexesOf(technicalTableId, configTable.Ressources_TID);
    return indexes.map(index => {
        return {
            id: configTable.id[index],
            manualSort: configTable.manualSort[index],
            Ressources_TID: configTable.Ressources_TID[index],
            Descripteur_IDCN: configTable.Descripteur_IDCN[index],
            Referentiel_OTCSURI: configTable.Referentiel_OTCSURI[index],
            Descripteur_PLCN: configTable.Descripteur_PLCN[index]
        }
    });
}