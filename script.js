document.addEventListener('DOMContentLoaded', function() {
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
    
    // Update task counters
    function updateTaskCounters() {
        totalTasksElement.textContent = totalTasks;
        completedTasksElement.textContent = completedTasks;
        pendingTasksElement.textContent = totalTasks - completedTasks;
    }
    
    // Add new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        // Remove empty state if it exists
        const emptyState = taskList.querySelector('.empty-state');
        if (emptyState) {
            taskList.innerHTML = '';
        }
        
        // Create task item
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        // Add priority class randomly for demo
        const priorities = ['low', 'medium', 'high'];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        taskItem.classList.add(priority);
        
        // Add creation date
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear().toString().slice(-2)}`;
        
        // Create task elements
        taskItem.innerHTML = `
            <div class="priority-indicator"></div>
            <div class="task-text">${taskText}</div>
            <div class="task-actions">
                <button class="complete-btn"><i class="fas fa-check"></i> Complete</button>
                <button class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
            </div>
            <div class="task-date">${dateString} ${timeString}</div>
        `;
        
        // Add to task list with animation
        taskList.appendChild(taskItem);
        
        // Add event listeners
        const removeButton = taskItem.querySelector('.remove-btn');
        const completeButton = taskItem.querySelector('.complete-btn');
        
        removeButton.addEventListener('click', function() {
            taskItem.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                taskList.removeChild(taskItem);
                totalTasks--;
                updateTaskCounters();
                
                // Show empty state if no tasks
                if (taskList.children.length === 0) {
                    taskList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-clipboard-list"></i>
                            <h3>No tasks yet</h3>
                            <p>Add your first task to get started!</p>
                        </div>
                    `;
                }
            }, 300);
        });
        
        completeButton.addEventListener('click', function() {
            taskItem.classList.toggle('completed');
            if (taskItem.classList.contains('completed')) {
                completedTasks++;
            } else {
                completedTasks--;
            }
            updateTaskCounters();
        });
        
        // Clear input and update counters
        taskInput.value = '';
        taskInput.focus();
        totalTasks++;
        updateTaskCounters();
    }
    
    // Event listeners
    addButton.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(event) {
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
});