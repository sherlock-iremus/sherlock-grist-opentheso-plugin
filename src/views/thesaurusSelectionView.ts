import { handleSearchButtonClick, handleSearchInputKeydown, handleThesaurusClick } from "../handlers";
import { currentThesaurus, thesauri } from "../state";
import { Thesaurus } from "../types/Thesaurus";
import { filterInput, openSidebarBtn, searchBtn, searchInput, selectedThesaurusLabel, sidebar, thesaurusLink, thesaurusList } from "./pluginHTMLElements";

export const showThesauriLoadingError = () => {
    thesaurusList.innerText = "Erreur de chargement.";
};

export const initializeThesauriView = () => {
    openSidebar();
    openSidebarBtn.addEventListener("click", openSidebar);

    searchBtn.addEventListener("click", () => handleSearchButtonClick(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
        handleSearchInputKeydown(e, searchInput.value);
    });

    filterInput.addEventListener("input", function () {
        const filterText = this.value.toLowerCase();
        const filtered = thesauri.filter(th =>
            (th.labels?.find(l => l.lang === "fr")?.title || "").toLowerCase().includes(filterText)
        );
        displayThesauri(filtered);
    });
}

export const displayThesauri = (thesauri: Thesaurus[]) => {
    thesaurusList.innerHTML = "";
    thesauri.forEach(th => {
        const item = document.createElement("div");
        item.className = "thesaurus-item";
        item.textContent = th.labels?.find(l => l.lang === "fr")?.title || th.idTheso;
        item.onclick = () => handleThesaurusClick(th);
        thesaurusList.appendChild(item);
    });
}

// Ferme le sidebar et affiche le bouton d'ouverture
export const closeSidebar = () => {
    sidebar.classList.add("closed");
    openSidebarBtn.style.display = "block";
}

// Ouvre le sidebar et masque le bouton d'ouverture
export const openSidebar = () => {
    sidebar.classList.remove("closed");
    openSidebarBtn.style.display = "none";
}