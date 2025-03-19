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
        this.shadowRoot.querySelector('button[id="clear-completed"]').addEventListener('click', (event) => {
            [...this.shadowRoot.querySelectorAll('todo-component[complete="true"]')].forEach(todo => {
                const todoId = todo.getAttribute('todo-id');
                localStorage.removeItem(todoId);
            })
            this.getTodos();
        });
        this.#internals.shadowRoot.querySelector('slot[name="todos"]').addEventListener('dragover',(event)=>{
                this.#internals.shadowRoot.querySelector('slot[name="todos"]').removeChild(event.target)
                this.#internals.shadowRoot.querySelector('slot[name="todos"]').appendChild(event.target)
        })
    }
    disconnectedCallback() {
    }
    storeTodo = (description, todoId) => {
        localStorage.setItem(todoId, description);
    }
    getTodos = () => {
        this.#internals.shadowRoot.querySelector('slot[name="todos"]').innerHTML = this.createTodoComponents();
    }
    createTodoComponents = () => {
        let html = "";

        Object.keys(localStorage).forEach(function (todoId) {
            const todo = JSON.parse(localStorage.getItem(todoId));
            if (todoId) {
                html += `
                   <todo-component 
                        description='${todo.description}'
                        todo-id='${todoId}'
                        complete='${todo.complete}'
                        draggable="true"
                    >
                  </todo-component>
                `;
            }

        });
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