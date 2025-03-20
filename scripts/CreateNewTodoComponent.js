export default class CreateNewTodoComponent extends HTMLElement {
    #internals;
    #form;
    constructor() {
        super();
        this.#internals = this.attachInternals();
    }
    connectedCallback(
    ) {
    this.#form = this.#internals.shadowRoot.querySelector("form");
        this.#internals.shadowRoot.querySelector('button[aria-label="create-a-new-todo"]').addEventListener('click', (event)=>{
            event.preventDefault()
        });
        this.#form.addEventListener('change', ()=>{
            const description=this.#internals.shadowRoot.querySelector('input[id="create-new-todo"]').value;
            const todoId=Date.now();
            this.storeTodo(description,todoId);
            window.dispatchEvent(new CustomEvent("Todo created", {}));
            this.#form.reset();
        }); 
    }
    disconnectedCallback() {
    }
    storeTodo=(description,todoId)=>{
        const order=localStorage.length;
        localStorage.setItem(todoId,JSON.stringify({description:description,complete:false,order:order}));
    }
    static get observedAttributes() {
        return [
        ];
    }
}
if (!customElements.get("create-new-todo-component")) {
    customElements.define("create-new-todo-component", CreateNewTodoComponent);
}