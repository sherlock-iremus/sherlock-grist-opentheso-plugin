export const trashcanIconClass = "fa-solid fa-trash-can";
export const checkmarkIconClass = "fa-solid fa-check";
export const plusIconClass = "fa-solid fa-plus";

export const getAddButtonElement = () => {
    const addBtn = document.createElement("button");
    const addIcon = document.createElement("i");
    addIcon.className = plusIconClass;
    addBtn.appendChild(addIcon);
    addBtn.className = "add-btn";

    return addBtn;
} 