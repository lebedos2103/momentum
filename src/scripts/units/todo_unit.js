import {Todo} from "../models/todo.js";
import {togglePopup} from "./popup_unit.js";

let todoElem = document.querySelector(".todo"),
    todoNewElem = document.querySelector(".todo__new"),
    todoListElem = document.querySelector(".todo__list");

let todo = new Todo("todos");

export async function initTodos() {
    updateTodoList(todo.getTodos())

    todoElem.addEventListener('click', togglePopup);

    todoNewElem.addEventListener("keypress", addTodo);
    todoNewElem.addEventListener("blur", addTodo);

    todoListElem.addEventListener("keypress", updateTodo);
    todoListElem.addEventListener("blur", updateTodo, true);

    todoListElem.addEventListener("click", checkTodo);
    todoListElem.addEventListener("click", removeTodo)

    window.addEventListener("beforeunload", () => todo.saveTodos());
}

function updateTodoList(todoList) {
    let todoDesignElem = `<li class="todo__list-item todo-item" data-id="{id}">
                                <input type="checkbox" class="todo-item__checkbox" {checked}>
                                <p contenteditable="true" class="todo-item__task {checkedClass}">{text}</p>
                                <div class="todo-item__delete"></div>
                            </li>`;

    todoListElem.innerHTML = todoList.map(todo => {
        return todoDesignElem.replace('{id}', todo.id)
            .replace('{checked}', todo.isDone ? "checked" : "")
            .replace('{checkedClass}', todo.isDone ? "todo-item__task_checked" : "")
            .replace('{text}', todo.text);
    }).join("\n");
}

function updateTodo(event) {
    doKeyboardAction(event, ".todo-item__task", () => {
        let task = event.target;
        let id = parseInt(task.parentElement.dataset.id);
        todo.updateTodo(id, task.innerHTML);
    });
    event.stopPropagation();
}

function addTodo(event) {
    if (!event.target.value) return;

    let result = doKeyboardAction(event, ".todo__new", () => {
        todo.addTodo(event.target.value);
        event.target.value = "";
    });

    result && updateTodoList(todo.getTodos());
    event.stopPropagation();
}

function checkTodo(event) {
    let result = doClickAction(event, ".todo-item__checkbox", todo.toggleTask.bind(todo));
    result && updateTodoList(todo.getTodos());
}

function removeTodo(event) {
    let result = doClickAction(event, ".todo-item__delete", todo.removeTodo.bind(todo));
    result && updateTodoList(todo.getTodos());
}

function doKeyboardAction(event, elemClassName, action) {
    if (!event.target.closest(elemClassName)) return false;

    if (event.type === "keypress") {
        if (event.key === "Enter") {
            action();
            event.target.blur();
            return true;
        }
    } else {
        action();
        return true;
    }

    return false;
}

function doClickAction(event, elemClassName, action) {
    if (!event.target.closest(elemClassName)) return false;

    let todoItem = event.target.closest(".todo-item");
    let id = parseInt(todoItem.dataset.id);

    action(id);

    event.stopPropagation();
    return true;
}