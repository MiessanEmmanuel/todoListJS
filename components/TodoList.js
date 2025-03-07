import { createELement } from "../functions/dom.js"

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */
export class TodoList {
    /** @type {Todo[]} */
    #todos = []
    /** @type {HTMLUListElement[]} */
    #list
    /** @type {NodeList[HTMLElement]} */
    #btnsFilter
    /**
     * @param {Todo[]} todos 
     */
    constructor(todos) {
        this.#todos = todos
    }

    /**
     * @param {HTMLUListElement} element 
     */
    appendTo(element) {
        element.innerHTML = `
      <form class="d-flex pb-4" id="form">
            <input required="" class="form-control" type="text" placeholder="Ajouter des tâches..." name="title"
                data-com.bitwarden.browser.user-edited="yes">
            <button class="btn btn-primary">Ajouter</button>
        </form>
        <main>
            <div class="btn-group mb-4" role="group">
                <button type="button" class=" btn btn-outline-primary active" data-filter="all">Toutes</button>
                <button type="button" class=" btn btn-outline-primary" data-filter="todo">A faire</button>
                <button type="button" class=" btn btn-outline-primary" data-filter="done">Faites</button>
            </div>

            <ul class="list-group todos">
            </ul>
        </main>
      `
        this.#list = element.querySelector('.list-group')
        for (let todo of this.#todos) {
            todo = new TodoListItem(todo)
            todo.appendTo(this.#list)
        }

        const form = document.querySelector('#form')
        form.addEventListener('submit', (e) => {
            this.onSubmit(e)
            form.reset()
        })

        this.#btnsFilter = document.querySelector('.btn-group')
        this.#btnsFilter.querySelectorAll('button').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.filter(e)

            })
        })





    }
    /**
     * @param {SubmitEvent} e 
     */
    onSubmit(e) {
        e.preventDefault()
        const title = new FormData(e.currentTarget).get('title').toString().trim();
        if (title === '') {
            return
        }
        const todo = {
            id: Date.now(),
            title,
            completed: false
        }
        const itemTodo = new TodoListItem(todo)
        itemTodo.prependTo(this.#list)

    }
    /**
    * @param {EventTarget} e 
    */
    filter(e) {
        e.preventDefault()
        const filtre = "data-filter"
        /* la partie active */
        const oldBtnActive = this.#btnsFilter.querySelector('.active')
        oldBtnActive.classList.remove('active')
        e.currentTarget.classList.toggle('active')
        /* la partie pour signifier l'etat à la liste  */
        const filterItem = e.currentTarget.getAttribute(filtre)
        const oldFilterItem = oldBtnActive.getAttribute(filtre)
        this.#list.classList.remove(oldFilterItem)
        this.#list.classList.add(filterItem)
    }
}

class TodoListItem {
    #element
    constructor(todo) {
        const id = `todo-${todo.id}`
        const li = createELement('li', {
            class: `todo list-group-item d-flex align-items-center ${todo.completed ? 'is_completed' : ''}`
        })
        const input = createELement('input', {
            class: 'form-check-input',
            id: id,
            type: 'checkbox',
            checked: todo.completed ? '' : null,
        })
        const label = createELement('label', {
            class: 'ms-2 form-check-label',
            for: id,
        })
        const button = createELement('button', {
            class: 'ms-auto btn btn-danger btn-sm',
        })
        li.append(input)
        label.innerText = todo.title
        li.append(label)
        button.innerHTML = '<i class="bi-trash"></i>'
        li.append(button)
        input.addEventListener('change', (e) => this.onChecked(e))
        button.addEventListener('click', (e) => this.remove(e))



        this.#element = li
    }
    /**
     * @param {HTMLElement} element 
     */
    appendTo(element) {
        element.append(this.#element)
    }

    /**
    * @param {HTMLElement} element 
    */
    prependTo(element) {
        element.prepend(this.#element)
    }
    /**
     * @param {PointerEvent} e 
     */
    remove(e) {
        e.preventDefault();
        this.#element.remove()
    }
    /**
     * @param {InputEvent} e 
     */
    onChecked(e) {
        /* ordre de la condition inversé, parceque l'input est checked avant de rentrer dans cette fonction */
        if (e.currentTarget.checked) {
            e.currentTarget.parentElement.classList.add('is_completed')
            return
        }
        e.currentTarget.parentElement.classList.remove('is_completed')

    }
}