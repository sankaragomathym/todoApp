
//var json = [ { task: "jog", completed: false }, {...} ];
var json = [];
var checkedCount = 0;

var input = document.getElementById('todoInput');
var todoList = document.querySelector('.todo-list');
var optionsCont = document.querySelector('.options-cont');
var activeCount = document.getElementById('activeCount');
var filters = document.querySelector('.filters');
var noItemsCont = document.getElementById('noItemsCont');
var note = document.querySelector(".note");

document.addEventListener("keypress", onEnter);
document.getElementById("themeSwitcher").addEventListener("click", switchTheme);

document.getElementById("all").addEventListener("click", showAll);
document.getElementById("active").addEventListener("click", filterActive);
document.getElementById("completed").addEventListener("click", filterCompleted);
document.getElementById("clearCompleted").addEventListener("click", clearCompleted);


init();

function init() {
    var theme = localStorage.getItem("theme");
    if(theme == "light") {
        document.body.classList.remove("dark");
    }

    //fetch json from localstorage
    if(localStorage.getItem("json") != null) {
        json = JSON.parse(localStorage.getItem("json"));
        displayList();
    }
}

function getCheckedCount() {
    checkedCount = 0;
    for(let i = 0; i < json.length; i++) {
        if(json[i].completed) {
            checkedCount++;
        }
    }
    return checkedCount;
}

//Initial state
function displayList() {
    var todoCount = json.length;
    checkedCount = getCheckedCount();

    todoList.innerHTML = "";
    if(todoCount) {
        for(let i = 0; i < todoCount; i++) {
            createListItem(i);
        }
        optionsCont.classList.remove("hide");
        var count = todoCount - checkedCount;
        activeCount.textContent = count + ((count <= 1) ? " item left" : " items left");
        note.classList.remove("hide");
    }
    else {
        optionsCont.classList.add("hide");
        note.classList.add("hide");
    }
}

function onEnter(e) {
    if(e.keyCode == 13) {
        addTodo();
    }
}

function addTodo() {
    var info = {};
    info.task = input.value;
    info.completed = false;
    json.push(info);
    localStorage.setItem("json", JSON.stringify(json));

    input.value = "";
    createListItem(json.length-1);
    if(json.length == 1) {
        optionsCont.classList.remove("hide");
        note.classList.remove("hide");
    }
    
    var count = json.length - checkedCount;
    activeCount.textContent = count + ((count <= 1) ? " item left" : " items left");
}

function createListItem(index) {
    var listItemHolder = document.createElement("div");
    listItemHolder.className = "list-item-holder";
    listItemHolder.dataset.index = index;
    listItemHolder.addEventListener("drop", drop);
    listItemHolder.addEventListener("dragover", allowDrop);

    var listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.draggable = "true";
    listItem.addEventListener("dragstart", dragStart);
    listItem.addEventListener("dragend", dragEnd);

    var label = document.createElement("label");
    listItem.appendChild(label);

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "todoCheck";
    checkbox.checked = json[index].completed;
    checkbox.addEventListener("change", checkboxHandler);
    label.appendChild(checkbox);

    var customcb = document.createElement("span");
    customcb.className = "custom-checkbox";
    label.appendChild(customcb);

    var todoTask = document.createElement("span");
    todoTask.className = "todo-task";
    todoTask.textContent = json[index].task;
    label.appendChild(todoTask);

    var delBtn = document.createElement("button");
    delBtn.className = "delete-button";
    delBtn.title = "Delete Button";
    delBtn.addEventListener("click", () => deleteTodo(listItemHolder));
    var icon = document.createElement("i");
    icon.className = "close-icon";
    delBtn.appendChild(icon);
    listItem.appendChild(delBtn);

    listItemHolder.appendChild(listItem);
    todoList.appendChild(listItemHolder);
}

function deleteTodo(listItemHolder) {
    var index = parseInt(listItemHolder.dataset.index);
    json.splice(index, 1);

    localStorage.setItem("json", JSON.stringify(json));

    //remove from DOM
    displayList();
}

function clearCompleted() {
    //get all checked elements
    for(let i = 0; i < json.length; i++) {
        if(json[i].completed) { //hide completed
            json.splice(i, 1);
            i--; //since json gets updated after splice
        }
    }
    checkedCount = 0;
    localStorage.setItem("json", JSON.stringify(json));
    displayList();
}

function checkboxHandler(e) {
    e.target.checked ? checkedCount++ : checkedCount--;
    var index = parseInt(e.target.parentNode.parentNode.parentNode.dataset.index);
    json[index].completed = e.target.checked;
    localStorage.setItem("json", JSON.stringify(json));

    var count = json.length - checkedCount;
    activeCount.textContent = count + ((count <= 1) ? " item left" : " items left");
}

function showAll() {  
    filters.className = "filters all";

    noItemsCont.classList.add("hide");

    var items = todoList.querySelectorAll(".list-item-holder");
    for(let i = 0; i < items.length; i++) {
        items[i].classList.remove("hide");
    }
}

function filterActive() {
    filters.className = "filters active";

    var items = todoList.querySelectorAll(".list-item-holder");
    for(let i = 0; i < items.length; i++) {
        var index = parseInt(items[i].dataset.index);
        if(json[index].completed) { //hide completed
            items[i].classList.add("hide");
        }
        else {
            items[i].classList.remove("hide"); 
        }
    }
    if(checkedCount == json.length) {
        noItemsCont.classList.remove("hide");
    }
    else {
        noItemsCont.classList.add("hide");
    }
}

function filterCompleted() {
    filters.className = "filters completed";

    var items = todoList.querySelectorAll(".list-item-holder");
    for(let i = 0; i < items.length; i++) {
        var index = parseInt(items[i].dataset.index);
        if(!json[index].completed) { //hide active
            items[i].classList.add("hide");
        }
        else {
            items[i].classList.remove("hide"); 
        }
    }

    if(!checkedCount) {
        noItemsCont.classList.remove("hide");  
    }
    else {
        noItemsCont.classList.add("hide");
    }
}

function switchTheme() {
    document.body.classList.toggle("dark");
    var theme = localStorage.getItem("theme");
    localStorage.setItem("theme", (theme == "light") ? "dark" : "light");
}


function dragStart(event) {
    var index = event.target.parentNode.dataset.index;
    event.target.classList.add("drag-item");
    event.dataTransfer.setData("draggedItem", index);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var fromIndex = parseInt(event.dataTransfer.getData("draggedItem"));
    
    var holders = document.querySelectorAll(".list-item-holder");
    var fromParent = holders[fromIndex];
    var draggedItem = fromParent.querySelector(".list-item");
    var jsonFromEl = json[fromIndex];

    var toParent = event.target;
    while(!toParent.classList.contains("list-item-holder")) {
        toParent = toParent.parentNode;
    }
    var toIndex = parseInt(toParent.dataset.index);

    (fromIndex < toIndex ) ? moveup(fromIndex, toIndex) : movedown(fromIndex, toIndex);
    
    toParent.appendChild(draggedItem);
    json[toIndex] = jsonFromEl;
    localStorage.setItem("json", JSON.stringify(json));
}

function dragEnd(event) {
    event.preventDefault();
    var el = document.querySelector(".drag-item");
    el.classList.remove("drag-item");
}

function moveup(fromIndex, toIndex) { // 0 -> 2 
    var holders = document.querySelectorAll(".list-item-holder");
    for(let i = fromIndex+1; i <= toIndex; i++) {
        holders[i-1].appendChild(holders[i].querySelector(".list-item"));
        json[i-1] = json[i];
    }
}

function movedown(fromIndex, toIndex) { // 2 -> 0 
    var holders = document.querySelectorAll(".list-item-holder");
    for(let i = fromIndex-1; i >= toIndex; i--) {
        holders[i+1].appendChild(holders[i].querySelector(".list-item"));
        json[i+1] = json[i];
    }
}

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('service worker registered'))
      .catch(err => console.log('service worker not registered', err));
}
