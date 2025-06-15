document.addEventListener('DOMContentLoaded', function () {
            // DOM elements
            const taskInput = document.getElementById('task-input');
            const addButton = document.getElementById('add-task-btn');
            const taskList = document.getElementById('task-list');
            const totalTasksElement = document.getElementById('total-tasks');
            const completedTasksElement = document.getElementById('completed-tasks');
            const pendingTasksElement = document.getElementById('pending-tasks');

            // Task counter
            let totalTasks = 0;
            let completedTasks = 0;

            // Task storage array
            let tasks = [];

            // Load tasks from localStorage
            function loadTasks() {
                const storedTasks = localStorage.getItem('tasks');
                if (storedTasks) {
                    tasks = JSON.parse(storedTasks);
                    renderTasks();
                }
            }

            // Save tasks to localStorage
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            // Update task counters
            function updateTaskCounters() {
                totalTasksElement.textContent = totalTasks;
                completedTasksElement.textContent = completedTasks;
                pendingTasksElement.textContent = totalTasks - completedTasks;
            }

            // Render tasks to the DOM
            function renderTasks() {
                // Clear task list
                taskList.innerHTML = '';

                if (tasks.length === 0) {
                    taskList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-clipboard-list"></i>
                            <h3>No tasks yet</h3>
                            <p>Add your first task to get started!</p>
                        </div>
                    `;
                    return;
                }

                // Create task elements
                tasks.forEach((task, index) => {
                    const taskItem = document.createElement('li');
                    taskItem.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;

                    // Add creation date
                    const date = new Date(task.date);
                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;

                    // Create task elements
                    taskItem.innerHTML = `
                        <div class="priority-indicator"></div>
                        <div class="task-text">${task.text}</div>
                        <div class="task-actions">
                            <button class="complete-btn"><i class="fas fa-${task.completed ? 'redo' : 'check'}"></i> ${task.completed ? 'Redo' : 'Complete'}</button>
                            <button class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
                        </div>
                        <div class="task-date">${dateString} ${timeString}</div>
                    `;

                    // Add event listeners
                    const removeButton = taskItem.querySelector('.remove-btn');
                    const completeButton = taskItem.querySelector('.complete-btn');

                    removeButton.addEventListener('click', function () {
                        taskItem.style.animation = 'fadeOut 0.3s ease';
                        setTimeout(() => {
                            // Remove from tasks array
                            tasks.splice(index, 1);
                            saveTasks();

                            // Update counters
                            if (task.completed) completedTasks--;
                            totalTasks--;
                            updateTaskCounters();

                            // Re-render tasks
                            renderTasks();
                        }, 300);
                    });

                    completeButton.addEventListener('click', function () {
                        task.completed = !task.completed;
                        saveTasks();

                        // Update counters
                        if (task.completed) {
                            completedTasks++;
                        } else {
                            completedTasks--;
                        }
                        updateTaskCounters();

                        // Re-render tasks
                        renderTasks();
                    });

                    // Add to task list
                    taskList.appendChild(taskItem);
                });
            }

            // Add new task
            function addTask() {
                const taskText = taskInput.value.trim();

                if (taskText === '') {
                    alert('Please enter a task!');
                    return;
                }

                // Create task object
                const newTask = {
                    text: taskText,
                    completed: false,
                    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                    date: new Date().toISOString()
                };

                // Add to tasks array
                tasks.push(newTask);
                saveTasks();

                // Update counters
                totalTasks++;
                updateTaskCounters();

                // Re-render tasks
                renderTasks();

                // Clear input
                taskInput.value = '';
                taskInput.focus();
            }

            // Event listeners
            addButton.addEventListener('click', addTask);

            taskInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    addTask();
                }
            });

            // Add animation for fadeOut
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(20px); }
                }
            `;
            document.head.appendChild(style);

            // Initialize the app
            loadTasks();
            updateTaskCounters();

            // Set counters based on loaded tasks
            totalTasks = tasks.length;
            completedTasks = tasks.filter(task => task.completed).length;
            updateTaskCounters();
        });