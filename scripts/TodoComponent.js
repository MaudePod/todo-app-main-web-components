const template = document.createElement("template");
template.innerHTML = `          
           <section class="todo">
              <label for="todo" aria-label="mark as Completed">
                <input type="checkbox" name="todo" id="todo">
                <span class="todo-detail" contenteditable="true" tabindex="0">
                </span>
              </label>
              <button popovertarget="confirm-delete" id="delete" aria-label="delete"></button>
              <section id="confirm-delete" popover>
                <span id='delete-message'>
                  Delete this todo
                </span>
                <section class="buttons">
                  <button popovertarget="confirm-delete">Cancel</button>
                  <button id="delete-todo"  popovertarget="confirm-delete">Delete</button>
                </section>
              </section>
            </section>
            <style>
              section[class="todo"] {
                  display: grid;
                  align-items: center;
                  font-weight: 700;
                  box-sizing: border-box;
                  padding: 0 20px;
                  grid-template-columns: 1fr auto;
                  counter-increment: todo-count  1;
                  width: var(--todo-width);
                  cursor:grab;
                  font-size:1.5em;
              }

              input[name="todo"] {
                appearance: none;
                border: 1px solid var(--inactive-color);
                border-radius: 50%;
                height: 25px;
                width: 25px;
                margin:0;
                cursor: pointer;
              }

              input[name="todo"]:hover {
                border: 1px solid var(--check-background);
                border: 1px solid var(--inactive-color);
              }

              input[name="todo"]:checked {
                height: 25px;
                width: 25px;
                background-repeat: no-repeat;
                background-position: center;
                background-image: url(./images/icon-check.svg), var(--check-background);
              }

              section[class="todo"]:has(input[name="todo"]:checked) {
                text-decoration: line-through;
                font-weight: 400;
              }

              button[id="delete"] {
                background-image: url(./images/icon-cross.svg);
                width: 25px;
                height: 25px;
                background-color: transparent;
                background-position: center;
                border: 0;
                background-size: contain;
                cursor: pointer;
              }

              section[id="confirm-delete"] {
                place-items: center;
                width: 500px;
                height: 200px;
                text-align: center;
                border: 0;
              }

              section[id="confirm-delete"]:popover-open {
                display: grid;
                background-color: var(--background-color);
              }

              section[class=buttons] {
                width: 80%;
                display: flex;
                justify-content: space-around;
              }

              section[class=buttons] button {
                cursor: pointer;
                padding: 5px 10px;
              }
              section[class=buttons] button:hover {
                font-weight:700;
              }

              label[for="todo"] {
                display: flex;
                grid-template-columns: min-content min-content;
                text-wrap: nowrap;
                place-items: center;
                gap: 10px;
                cursor: pointer;
              }

              @starting-style {
                section[id="confirm-delete"] {
                  opacity: 0;
                }
              }
            </style>
`;
export default class TodoComponent extends HTMLElement {
  constructor() {
    super();
  }
  #todoId;
  connectedCallback(
  ) {
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: "open" })
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
    if (this.hasAttribute('todo-id')) {
      this.#todoId = this.getAttribute('todo-id');
    }
    if (this.hasAttribute('description')) {
      const description = this.getAttribute('description');
      this.shadowRoot.querySelector("span[class='todo-detail']").innerHTML = description;
      this.shadowRoot.querySelector("span[id='delete-message']").innerHTML = "Delete \"" + description + "\" ?";
    }
    if (this.hasAttribute('complete')) {
      const complete = this.getAttribute('complete');
      if (complete === "true") {
        this.shadowRoot.querySelector('input[id="todo"]').checked = true;
      }
    }

    this.shadowRoot.querySelector('span[class="todo-detail"]').addEventListener('blur', (event) => {
      const description = this.shadowRoot.querySelector('span[class="todo-detail"]').innerHTML;
      if (this.shadowRoot.querySelector('input[id="todo"]').checked) {
        sessionStorage.setItem(this.#todoId, JSON.stringify({ description: description, complete: true, order: this.getAttribute('order') }));
      } else {
        sessionStorage.setItem(this.#todoId, JSON.stringify({ description: description, complete: false, order: this.getAttribute('order') }));
      }
      window.dispatchEvent(new CustomEvent("Todo updated", {}));
    });
    this.shadowRoot.querySelector('input[id="todo"]').addEventListener('click', (event) => {
      if (this.shadowRoot.querySelector('input[id="todo"]').checked) {
        sessionStorage.setItem(this.#todoId, JSON.stringify({ description: this.getAttribute('description'), complete: true, order: this.getAttribute('order') }));
      } else {
        sessionStorage.setItem(this.#todoId, JSON.stringify({ description: this.getAttribute('description'), complete: false, order: this.getAttribute('order') }));
      }
      window.dispatchEvent(new CustomEvent("Todo completed", {}));
    });
    this.shadowRoot.querySelector('button[id="delete-todo"]').addEventListener('click', (event) => {
      sessionStorage.removeItem(this.#todoId);
      window.dispatchEvent(new CustomEvent("Todo deleted", {}));
    });

  }

  disconnectedCallback() {
  }

  static get observedAttributes() {
    return [
      'todo-id',
      'description',
      'complete',
      'order'
    ];
  }
}
if (!customElements.get("todo-component")) {
  customElements.define("todo-component", TodoComponent);
}