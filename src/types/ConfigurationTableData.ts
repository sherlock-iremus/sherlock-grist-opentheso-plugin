import { GristTableData } from "./GristTableData";

export interface ConfigurationTableData extends GristTableData {
	id: number[];
	manualSort: number[];
	table: string[];
	uri: string[];
	thesaurus: string[];
	label: string[];
}

