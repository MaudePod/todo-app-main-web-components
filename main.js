import CreateNewTodoComponent from "./scripts/CreateNewTodoComponent.js";
import TodosComponent from "./scripts/TodosComponent.js";

if (sessionStorage.getItem('theme')) {
    const theme = sessionStorage.getItem('theme');
    if (theme == 'dark') {
        document.querySelector('input[id="dark-theme"]').checked = true;
    } else {
        document.querySelector('input[id="light-theme"]').checked = true;
    }
}
document.querySelector('input[id="dark-theme"]').addEventListener('change', () => {
    if (document.querySelector('input[id="dark-theme"]').checked) {
        sessionStorage.setItem('theme', 'dark')
    }
})
document.querySelector('input[id="light-theme"]').addEventListener('change', () => {
    if (document.querySelector('input[id="light-theme"]').checked) {
        sessionStorage.setItem('theme', 'light')
    }
})