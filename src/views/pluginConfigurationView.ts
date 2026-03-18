import { configWarningDiv, contentDiv, configWarningList } from "../views/pluginHTMLElements";

export const displayMalformedConfigurationTable = () => {
    const li = document.createElement("li");
    li.textContent = "Votre table de configuration est incorecte ou incomplète."
    configWarningList.appendChild(li);
    configWarningDiv.style.display = "block";
    contentDiv.style.display = "none";
}

export const displayColumnsMissing = (labelMissing: FormattedConfigurationTableRecord[], uriMissing: FormattedConfigurationTableRecord[]) => {
    for (const col of uriMissing) {
        const li = document.createElement("li");
        li.textContent = `${col.uri}`
        configWarningList.appendChild(li);
    };
    for (const col of labelMissing) {
        const li = document.createElement("li");
        li.textContent = `${col.label}`
        configWarningList.appendChild(li);
    };
    configWarningDiv.style.display = "block";
    contentDiv.style.display = "none";
}

export const displayConfigurationOK = () => {
    configWarningDiv.style.display = "none";
    contentDiv.style.display = "block";
}