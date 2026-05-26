import { getConceptLabels } from "../api/opentheso";
import { configTableRecords, currentRecord } from "../state";
import { CONCEPT_SEPARATOR } from "../utils/consts";
import { updateRecordColumn } from "./recordController";

export const generateLabelsForCurrentRecord = async () => {
    if (currentRecord) {
        const updatedRecord: Partial<typeof currentRecord> = { };
        const id = currentRecord.id;
        for (const configRecord of configTableRecords) {
            console.log("Processing column labels: ", configRecord.Descripteur_PLCN);
            if (!(configRecord.Descripteur_PLCN in currentRecord))
                console.warn('Column does not exist: ', configRecord.Descripteur_PLCN)
            else {
                console.log("Current state: ", currentRecord[configRecord.Descripteur_PLCN]);
                const newLabels = [];
                for (const conceptId of currentRecord[configRecord.Descripteur_IDCN].split(CONCEPT_SEPARATOR).filter((uri: string) => uri.trim())) {
                    console.log("Fetching concept id label: ", conceptId);
                    const idThesaurus = (new URL(conceptId)).searchParams.get("idt");
                    const idConcept = (new URL(conceptId)).searchParams.get("idc");
                    console.log("Extracted idThesaurus and idConcept: ", idThesaurus, idConcept);
                    const openThesoLabel = await getConceptLabels(idThesaurus || "", idConcept || "")
                    if (openThesoLabel && openThesoLabel.label) {
                        console.log("Fetched concept label: ", openThesoLabel.label);
                        newLabels.push(openThesoLabel.label);
                    } else {
                        console.warn("Label not found for concept id: ", conceptId);
                    }
                }
                updatedRecord[configRecord.Descripteur_PLCN] = newLabels.join(CONCEPT_SEPARATOR);
                console.log("Final labels for column ", configRecord.Descripteur_PLCN, ": ", newLabels);
            }
        }
        updateRecordColumn(updatedRecord, id);
    }
}