// Select DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');
const darkModeBtn = document.getElementById('dark-mode-btn'); // Button to toggle dark mode
const body = document.body; // Body element for applying dark mode

// Initialize tasks array from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filterStatus = 'all'; // Tracks the filter status: 'all', 'completed', 'pending'

// Check if dark mode preference is stored in localStorage and apply it
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
}

// Abstract Method to hide/show tasks
function filterTasks() {
    // Clear the current task list display
    taskList.innerHTML = ''; 
    
    // Filter tasks based on the selected filterStatus
    tasks.forEach(task => {
        if (filterStatus === 'all') {
            renderTask(task); // Show both completed and pending tasks
        } else if (filterStatus === 'completed' && task.completed) {
            renderTask(task); // Show only completed tasks
        } else if (filterStatus === 'pending' && !task.completed) {
            renderTask(task); // Show only pending tasks
        }
    });
}

// Function to render a task on the screen
function renderTask(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    if (task.completed) taskElement.classList.add('completed');

    taskElement.innerHTML = `
        <span>${task.name}</span>
        <div>
            <button class="mark-complete-btn">Complete</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Mark task as completed
    taskElement.querySelector('.mark-complete-btn').addEventListener('click', () => {
        task.completed = !task.completed;
        saveTasks();
        filterTasks();
    });

    // Edit task
    taskElement.querySelector('.edit-btn').addEventListener('click', () => {
        const newName = prompt('Edit task:', task.name);
        if (newName) {
            task.name = newName;
            saveTasks();
            filterTasks();
        }
    });

    // Delete task
    taskElement.querySelector('.delete-btn').addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        saveTasks();
        filterTasks();
    });

    taskList.appendChild(taskElement);
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add new task
addTaskBtn.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    if (taskName !== '') {
        tasks.push({ name: taskName, completed: false });
        taskInput.value = '';
        saveTasks();
        filterTasks();
    }
});

// Add filter functionality for showing All, Pending, and Completed tasks
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (event.target.id === 'completed-tasks') {
            filterStatus = 'completed';  // Show only completed tasks
        } else if (event.target.id === 'pending-tasks') {
            filterStatus = 'pending';  // Show only pending tasks
        } else {
            filterStatus = 'all'; // Show both completed and pending tasks
        }
        filterTasks();
    });
});

// Dark Mode toggle functionality
darkModeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // Save dark mode preference to localStorage
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Initial render of tasks
filterTasks();
