import { TodoList } from "./components/TodoList.js";
import { fetchJSON } from "./functions/api.js";
import { createELement } from "./functions/dom.js";

try {
    const todos = await fetchJSON('https://jsonplaceholder.typicode.com/todos?_limit=5')
    const list = new TodoList(todos)
    list.appendTo(document.querySelector('#todolist'))

} catch (error) { 

 const alertElement = createELement('div', {
    class : 'alert alert-danger m-4',
    type : 'alert'
  })
  alertElement.innerText= 'Impossible de charger les élément'
  document.body.prepend(alertElement)
  
  console.error(error)
}