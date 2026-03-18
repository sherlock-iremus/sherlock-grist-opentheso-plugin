import { fetchThesauri, searchConceptsInThesaurus } from "../api/opentheso";
import { handleSearchConceptsFetched, handleThesauriFetched } from "../handlers";
import { currentThesaurus, setSearchQuery } from "../state";
import { OpenthesoConcept } from "../types/OpenthesoConcept";
import { displayError, displayLoading, displaySearchResults } from "../views/thesaurusSearchConceptsView";

export const initializeAndFetchThesauri = async () => {
    try {
        fetchThesauri().then(fetchedThesauri => handleThesauriFetched(fetchedThesauri));
    } catch (error) {
        console.error(error);
    }
};

export const renderSelectedIndexationType = () => {
    renderSearchResults();
}

export const searchConcepts = async (query: string) => {
    if (!query.trim()) return;
    displayLoading()
    try {
        const concepts: OpenthesoConcept[] = await searchConceptsInThesaurus(currentThesaurus.idTheso, query);
        setSearchQuery(query); 
        handleSearchConceptsFetched(concepts);
    } catch (e) {
        let error = "Erreur inconnue";
        if (currentThesaurus && currentThesaurus.idTheso) {
            error = "Erreur lors de la recherche dans le thésaurus."
            console.error(error, currentThesaurus.idTheso, e);
        }
        displayError(error)
    }
}
        
export const renderSearchResults = () => {
    displaySearchResults();
}