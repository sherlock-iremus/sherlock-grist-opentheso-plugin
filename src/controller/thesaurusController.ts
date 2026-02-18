import { fetchThesauri, getConceptLabels, searchConceptsInThesaurus } from "../api/opentheso";
import { handleSearchConceptsFetched, handleThesauriFetched } from "../handlers";
import { currentRecord, currentThesaurus } from "../state";
import { getBroaderIdForConcept, OpenthesoConcept } from "../types/OpenthesoConcept";
import { displayError, displayLoading, displaySearchResults, displayThesaurusSelected } from "../views/thesaurusSearchConceptsView";

export const initializeAndFetchThesauri = async () => {
    try {
        fetchThesauri().then(fetchedThesauri => handleThesauriFetched(fetchedThesauri));
    } catch (error) {
        console.error(error);
    }
};

export const renderSelectedIndexationType = () => {
    displayThesaurusSelected();
    renderSearchResults();
}

export const searchConcepts = async (query: string) => {
    if (!query.trim()) return;
    displayLoading()
    try {
        const concepts: OpenthesoConcept[] = await searchConceptsInThesaurus(currentThesaurus.idTheso, query);
        await Promise.all(concepts.map(async concept => {
            const broaderId = getBroaderIdForConcept(concept);
            if (broaderId) concept.broaderLabel = (await getConceptLabels(currentThesaurus.idTheso, broaderId)).label;
            return concept;
        }))
        handleSearchConceptsFetched(concepts);
    } catch (e) {
        let error
        if (!currentRecord) {
            error = "Veuillez d'abord sélectionner une ressource."
            console.error(error, currentThesaurus.idTheso, e);
        }
        else if (currentThesaurus && currentThesaurus.idTheso) {
            error = "Erreur lors de la recherche dans le thésaurus."
            console.error(error, currentThesaurus.idTheso, e);
        } else {
            error = "Veuillez d'abord sélectionner un thésaurus."
            console.error(error);
        }
        displayError(error)
    }
}
        
export const renderSearchResults = () => {
    displaySearchResults();
}