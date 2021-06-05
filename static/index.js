function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
var activeItem = null;

const requestHeader = {
    method: 'POST', // Method itself
    headers: {
        'Content-type': 'application/json; charset=UTF-8', // Indicates the content 
        'X-CSRFToken': csrftoken // csrf token for authentication
        },
}




// Todo Application Logic
$(document).ready(function() {

    // jQuery methods go here...
    createList(renderList)
});

function createList() {
    const address = 'http://localhost:8000/api/task/all';
    RequestData(address, callback=renderList)
}

function createTask(form) {
    var address = 'http://localhost:8000/api/task/create';
    var item = { title: $("#title")[0].value };
    
    if (activeItem) {
        update(activeItem)
    } else {
        requestHeader['body'] = JSON.stringify(item)
        RequestData(address, createList, requestHeader)    
    }

    // reset the form and activeItem
    $("#title")[0].value = '';
    activeItem = null
}

// identifies the update mode and updates the task
function update(item, status=false) {
    address = `http://localhost:8000/api/task/update/${item.id}`;

    if (!status) {
        item.title = $('#title')[0].value
    }
    
    requestHeader['body'] = JSON.stringify(item)
    RequestData(address, createList, requestHeader)
}


// for removing the task from list as well as database
function removeTask(item) {
    const address = `http://localhost:8000/api/task/delete/${item.id}`;
    const element = `#task-item-${item.id}`;

    requestHeader['method'] = 'DELETE';

    // removes the item from the DOM
    function remove() {
        $(element)[0].remove()
    }
    RequestData(address, remove, requestHeader)
}

// for updating the task
function updateTask(item) {
    activeItem = item;
    $("form input#title")[0].value = activeItem.title;
}

// for updating the status of the task
function UpdateStatus(item) {
    item.status = !item.status
    update(item, status=true)
}


function RequestData(address, callback, requestHeader={}) {
    // first fetch all the data available in the database
    fetch(address, requestHeader) 
    .then(function(response) {
        // convert the response to json format
        return response.json()
    })
    .then(function(data) {
        // call the function to render the requested data
        callback(data)
    })
}

function renderList(data, render=true){
    console.log(data)
    const wrapper = $('#list-wrapper')[0]
    wrapper.innerHTML = '' // remove every thing from list wrapper before rendering list

    // transform the fetched data to list of elements
    const taskList = data.map(function(element) {
        if (element.status) {
            var taskTitle = `<strike>${element.title}</strike>`
        } else {
            var taskTitle = `${element.title}`
        }

        return (
            `
                <div class="task-item d-flex align-items-center" id='task-item-${element.id}'>
                    <h6 class="m-0 task-title">${taskTitle}</h6>

                    <a class="btn btn-sm btn-danger ml-auto delete">Remove</a>

                    <a class="btn btn-sm btn-warning ml-2 update">edit</a>
                </div>
            `
        )
    });

    if (render) {
        // if render is true then render the list
        taskList.forEach(element => {
            wrapper.innerHTML += element
        });

        // initialize events only when the list is rendered
        initEvents(data)
    }

    return taskList
}


function initEvents(data) {
    data.forEach(element => {
        var deleteButton = `#task-item-${element.id} a.delete`;
        var updateButton = `#task-item-${element.id} a.update`;
        var statusButton = `#task-item-${element.id} .task-title`

        // Binding Delete Handler 
        $(deleteButton)[0].addEventListener('click', (item => {
            return function() {
                removeTask(item)
            } 
        })(element));

        // Binding Update Handler 
        $(updateButton)[0].addEventListener('click', (item => {
            return function() {
                updateTask(item)
            } 
        })(element));

        // Binding status Handler 
        $(statusButton)[0].addEventListener('click', (item => {
            return function() {
                UpdateStatus(item)
            } 
        })(element));

    });
}