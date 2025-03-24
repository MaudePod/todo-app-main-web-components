import TodoComponent from "./TodoComponent.js";

export default class TodosComponent extends HTMLElement {
    #internals;
    #form;
    constructor() {
        super();
        this.#internals = this.attachInternals();
    }
    connectedCallback(
    ) {
        this.getTodos();
        window.addEventListener('Todo created', (event) => {
            this.getTodos();
        });
        window.addEventListener('Todo deleted', (event) => {
            this.getTodos();
        });
        window.addEventListener('Todo completed', (event) => {
            this.getTodos();
        });
        window.addEventListener('Todo updated', (event) => {
            this.getTodos();
        });
        this.shadowRoot.querySelector('button[id="clear-completed"]').addEventListener('click', (event) => {
            this.getTodos();
            this.setListOfCompletedTodos();
        });
        this.shadowRoot.querySelector('button[id="delete-todo"]').addEventListener('click', (event) => {
            [...this.shadowRoot.querySelectorAll('todo-component[complete="true"]')].forEach(todo => {
                const todoId = todo.getAttribute('todo-id');
                localStorage.removeItem(todoId);
            })
            this.getTodos();
            this.updateTheOrderOfTodos();
            this.getTodos();
        });
        this.#internals.shadowRoot.querySelector('slot[name="todos"]').addEventListener('dragover', (event) => {
            event.preventDefault();
            this.moveTodoToNewPlaceInUI(event.target)
            this.updateTheOrderOfTodos();
        })
    }
    disconnectedCallback() {
    }

    getTodos = () => {
        this.#internals.shadowRoot.querySelector('slot[name="todos"]').innerHTML = this.createTodoComponents();
    }
    setListOfCompletedTodos = () => {
        let listItems = "";
        [...this.shadowRoot.querySelectorAll('todo-component[complete="true"]')].forEach(todo => {
            listItems += "<li>" + todo.getAttribute('description') + "</li>";
        })
        this.#internals.shadowRoot.querySelector('ul[class="completed-todos"]').innerHTML = listItems;
    }
    moveTodoToNewPlaceInUI = (todo) => {
        if (todo instanceof TodoComponent) {
            this.#internals.shadowRoot.querySelector('slot[name="todos"]').removeChild(todo)
            this.#internals.shadowRoot.querySelector('slot[name="todos"]').appendChild(todo)
        }
    }
    updateTheOrderOfTodos = () => {
        const todos = [...this.#internals.shadowRoot.querySelectorAll('todo-component')];
        for (let index = 0; index < todos.length; index++) {
            const todo = todos[index];
            const todoId = todo.getAttribute('todo-id');
            const description = todo.getAttribute('description');
            const complete = todo.getAttribute('complete');
            const order = index;
            const updatedTodo = { description: description, complete: complete, order: order };
            localStorage.setItem(todoId, JSON.stringify(updatedTodo));
        }
    }
    createTodoComponents = () => {
        let html = "";
        const todos = [];
        Object.keys(localStorage).forEach(function (todoId) {
            const todo = JSON.parse(localStorage.getItem(todoId));
            const updatedTodo = { todoId: todoId, description: todo.description, complete: todo.complete, order: todo.order };
            todos[todo.order] = updatedTodo;
        });
        for (let index = 0; index < todos.length; index++) {
            const todo = todos[index];
            if (todo == undefined) {
                continue;
            }
            if (todo.todoId) {
                html += `
               <todo-component 
                    description='${todo.description}'
                    todo-id='${todo.todoId}'
                    complete='${todo.complete}'
                    order='${todo.order}'
                    draggable="true"
                >
              </todo-component>
            `;
            }
        }
        if (localStorage.length == 0 || html == "") {
            html = `
                        <span class="no-todos">
                            No todos have been created
                        </span>
                    `;
        }
        return html;
    }

    static get observedAttributes() {
        return [
        ];
    }
}
if (!customElements.get("todos-component")) {
    customElements.define("todos-component", TodosComponent);
}