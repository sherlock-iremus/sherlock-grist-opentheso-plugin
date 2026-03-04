import { configWarningDiv, contentDiv, configWarningList } from "../views/pluginHTMLElements";

export const displayColumnsMissing = (labelMissing: FormattedConfigurationTableRecord[], uriMissing: FormattedConfigurationTableRecord[]) => {
    for (const col of uriMissing) {
        const li = document.createElement("li");
        li.textContent = `${col.uri} (colonne d'URIs)`
        configWarningList.appendChild(li);
    };
    for (const col of labelMissing) {
        const li = document.createElement("li");
        li.textContent = `${col.label} (colonne de libellés)`
        configWarningList.appendChild(li);
    };
    configWarningDiv.style.display = "block";
    contentDiv.style.display = "none";
}

export const displayConfigurationOK = () => {
    configWarningDiv.style.display = "none";
    contentDiv.style.display = "block";
}