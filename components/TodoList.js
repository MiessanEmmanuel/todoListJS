import { cloneTemplate, createELement } from "../functions/dom.js"
import { getItemFromLocalStorage, setItemToLocalStorage } from "../functions/localStorage.js"

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
     * @param {HTMLElement} element 
     */
    appendTo(element) {
        const template = cloneTemplate('todolist-layout')
        element.append(template)
        this.#list = element.querySelector('.list-group')
        for (let todoItem of this.#todos) {
            todoItem = new TodoListItem(todoItem)
            todoItem.appendTo(this.#list)
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
        this.#onUpdate(todo)

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

    #onUpdate(todo) {
        this.#todos = [todo, ...this.#todos]
        localStorage.setItem('todos', JSON.stringify(
            this.#todos
        ))
    }
}

class TodoListItem {
    #element
    #todo
    constructor(todo) {
        this.#todo = todo
        const liTemplate = cloneTemplate('todolist-item').firstElementChild
        const id = `todo-${todo.id}`
        this.#element = liTemplate
        const input = this.#element.querySelector('input')
        input.setAttribute('id', id)
        if (todo.completed) {
            input.setAttribute('checked', '')
            liTemplate.classList.add('is_completed')
        }

        const label = this.#element.querySelector('label')
        label.setAttribute('for', id)
        label.innerText = todo.title
        const button = this.#element.querySelector('button')

        input.addEventListener('change', (e) => this.onChecked(e))
        button.addEventListener('click', (e) => this.remove(e))

        document.body.addEventListener('delete', (e) => {
            console.log('Event deletes', e.detail)
        })


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
        let todos = getItemFromLocalStorage('todos')
        todos = todos.filter(t => t.id !== this.#todo.id)
        localStorage.setItem('todos', JSON.stringify(
            todos
        ))
        const event = new CustomEvent('delete', {
            detail: e.currentTarget,
            bubbles: true
        })
        this.#element.dispatchEvent(event)
        this.#element.remove()
    }
    /**
     * @param {InputEvent} e 
     */
    onChecked(e) {
        let todos = getItemFromLocalStorage('todos')
        todos.forEach(t => {
            if (t.id === this.#todo.id) t.completed = !t.completed
        })
        setItemToLocalStorage('todos', todos)
        /* ordre de la condition inversé, parceque l'input est checked avant de rentrer dans cette fonction */
        if (e.currentTarget.checked) {
            e.currentTarget.parentElement.classList.add('is_completed')
            return
        }
        e.currentTarget.parentElement.classList.remove('is_completed')

    }


}