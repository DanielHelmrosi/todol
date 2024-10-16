const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskinput');
const tasksList = document.querySelector('#tasklist');
const emptyList = document.querySelector('#emptylist');

let tasks = [];

// Загружаем задачи из localStorage, если они есть
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', handleTaskAction);


function addTask(event) {
    event.preventDefault();

    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

function handleTaskAction(event) {
    if (event.target.dataset.action === 'delete') {
        deleteTask(event);
    } else if (event.target.dataset.action === 'done') {
        doneTask(event);
    }
}

function deleteTask(event) {
    const parentNode = event.target.closest('.list-group-item'); // исправлено
    const id = Number(parentNode.id);

    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();

    parentNode.remove();

    checkEmptyList();
}

function doneTask(event) {
    const parentNode = event.target.closest('.list-group-item');
    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptylist" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
        </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } else {
        const emptyListEl = document.querySelector('#emptylist');
        if (emptyListEl) {
            emptyListEl.remove();
        }
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Delete" width="18" height="18">
                </button>
            </div>
        </li>`;

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
