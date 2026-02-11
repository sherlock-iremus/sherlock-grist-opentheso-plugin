import { handleSearchButtonClick, handleSearchInputKeydown } from "../handlers";
import { thesauri } from "../state";
import { openSidebarBtn, searchBtn, searchInput, sidebar } from "./pluginHTMLElements";

export const initializeSideBarView = () => {
    openSidebar();
    openSidebarBtn.addEventListener("click", openSidebar);

    searchBtn.addEventListener("click", () => handleSearchButtonClick(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
        handleSearchInputKeydown(e, searchInput.value);
    });
}

/*DELETE : export const displayThesauri = (thesauri: Thesaurus[]) => {
    thesaurusList.innerHTML = "";
    thesauri.forEach(th => {
        const item = document.createElement("div");
        item.className = "thesaurus-item";
        item.textContent = th.labels?.find(l => l.lang === "fr")?.title || th.idTheso;
        item.onclick = () => handleThesaurusClick(th);
        thesaurusList.appendChild(item);
    });
}*/

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