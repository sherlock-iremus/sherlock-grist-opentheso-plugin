import { getConceptLabels } from "../api/opentheso";
import { configTableRecords, currentRecord } from "../state";

export const generateLabelsForCurrentRecord = () => {
    if (currentRecord) {
        configTableRecords.forEach(configRecord => {
            console.log("Processing column labels: ", configRecord.label);
            if (!currentRecord[configRecord.label])
                console.warn('Column does not exist: ', configRecord.label)
            else {
                console.log("Current state: ", currentRecord[configRecord.label]);
                currentRecord[configRecord.uri].split(";").forEach((conceptId: string) => {
                    console.log("Fetching concept id label: ", conceptId);
                    const idThesaurus = (new URL(conceptId)).searchParams.get("idt");
                    const idConcept = (new URL(conceptId)).searchParams.get("idc");
                    console.log("Extracted idThesaurus and idConcept: ", idThesaurus, idConcept);
                    getConceptLabels(idThesaurus || "", idConcept || "").then(concept => {
                        console.log("Fetched concept label: ", concept.label);
                    });
                });
            }
        })
    }
}