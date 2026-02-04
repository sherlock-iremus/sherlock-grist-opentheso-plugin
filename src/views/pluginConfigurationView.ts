import { RESOURCE_COLUMN_NAME } from "../utils/consts";
import { pluginConfigurationDiv } from "../views/pluginHTMLElements";

export const displayResourceColumnMissing = () => {
    pluginConfigurationDiv.textContent = `Veuillez créer une colonne qui s'appelle ${RESOURCE_COLUMN_NAME} et qui contient l'uuid de la resource indexée.`
    pluginConfigurationDiv.style.display = "block";
}

export const displayColumnsMissing = (labelMissing: FormattedConfigurationTableRecord[], uriMissing: FormattedConfigurationTableRecord[]) => {
    pluginConfigurationDiv.innerHTML = `Les colonnes suivantes sont configurées mais non crées. <br/>Label : ${labelMissing.map(col => col.label).join(", ")}<br/>URI : ${uriMissing.map(col => col.uri).join(", ")}`
    pluginConfigurationDiv.style.display = "block";
}

export const displayConfigurationOK = () => {
    pluginConfigurationDiv.textContent = "";
    pluginConfigurationDiv.style.display = "none";
}