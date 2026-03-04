import { configWarningDiv, contentDiv, configWarningList } from "../views/pluginHTMLElements";

export const displayColumnsMissing = (labelMissing: FormattedConfigurationTableRecord[], uriMissing: FormattedConfigurationTableRecord[]) => {
    for (const col of uriMissing) {
        configWarningList.appendChild((() => {
            const li = document.createElement("li");
            li.textContent = `${col.uri} (thésaurus : ${col.thesaurus})`
            return li;
        })());
    }
    for (const col of labelMissing) {
        configWarningList.appendChild((() => {
            const li = document.createElement("li");
            li.textContent = `${col.label} (thésaurus : ${col.thesaurus})`
            return li;
        })());
    }
    configWarningDiv.style.display = "block";
    contentDiv.style.display = "none";
}

export const displayConfigurationOK = () => {
    configWarningDiv.style.display = "none";
    contentDiv.style.display = "block";
}