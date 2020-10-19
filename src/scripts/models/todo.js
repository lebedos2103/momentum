export class Todo {
    _todoItems = [];

    constructor(localStorageName) {
        this._localStorageName = localStorageName;
        this._todoItems = JSON.parse(localStorage.getItem(localStorageName)) || [];
    }

    _generateTodoId() {
        for (let i = 1; ; i++)
            if (!this._todoItems.find((item) => item.id === i))
                return i;
    }

    addTodo(text) {
        this._todoItems.push({
            id: this._generateTodoId(),
            text,
            isDone: false
        });
    }

    updateTodo(id, text) {
        let item = this._todoItems.find((item) => item.id === id);
        if (item)
            item.text = text;
    }

    removeTodo(id) {
        let index = this._todoItems.findIndex((item) => item.id === id);
        if (index >= 0)
            this._todoItems.splice(index, 1);
    }

    toggleTask(id) {
        let item = this._todoItems.find((item) => item.id === id);
        if (item)
            item.isDone = !item.isDone;
    }

    getTodos() {
        return this._todoItems;
    }

    saveTodos() {
        localStorage.setItem(this._localStorageName, JSON.stringify(this._todoItems));
    }
}