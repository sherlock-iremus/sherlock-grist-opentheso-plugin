import { GristTableData } from "./GristTableData";

export interface ConfigurationTableData extends GristTableData {
	id: number[];
	manualSort: number[];
	Ressources_TID: string[];
	Descripteur_IDCN: string[];
	Referentiel_OTCSURI: string[];
	Descripteur_PLCN: string[];
}

