import { getConceptLabels } from "../api/opentheso";
import { configTableRecords, currentRecord } from "../state";
import { updateRecordColumn } from "./recordController";

export const generateLabelsForCurrentRecord = async () => {
    if (currentRecord) {
        const updatedRecord: Partial<typeof currentRecord> = { };
        const id = currentRecord.id;
        for (const configRecord of configTableRecords) {
            console.log("Processing column labels: ", configRecord.label);
            if (!(configRecord.label in currentRecord))
                console.warn('Column does not exist: ', configRecord.label)
            else {
                console.log("Current state: ", currentRecord[configRecord.label]);
                const newLabels = [];
                for (const conceptId of currentRecord[configRecord.uri].split(";").filter((uri: string) => uri.trim())) {
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
                updatedRecord[configRecord.label] = newLabels.join(";");
                console.log("Final labels for column ", configRecord.label, ": ", newLabels);
            }
        }
        updateRecordColumn(updatedRecord, id);
    }
}