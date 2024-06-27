// Theme toggle
document.getElementById('theme-toggle').addEventListener('change', (event) => {
    document.body.setAttribute('data-theme', event.target.checked ? 'dark' : 'light');
    localStorage.setItem('theme', event.target.checked ? 'dark' : 'light');
});

// Set theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-toggle').checked = savedTheme === 'dark';
});

// User avatar and dropdown
function updateUserAvatar(email) {
    const avatar = document.getElementById('user-avatar');
    const initials = email.split('@')[0].substring(0, 2).toUpperCase();
    avatar.textContent = initials;
    avatar.style.display = 'flex';
}

document.getElementById('user-avatar').addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('.dropdown-content').style.display = 'block';
});

document.addEventListener('click', () => {
    document.querySelector('.dropdown-content').style.display = 'none';
});

document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

// Tab navigation
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    // Hide all tab content
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the active class from all tab links
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    if (tabName === 'PastNotes') {
        loadPastNotes();
    }
}

async function loadPastNotes() {
    try {
        const response = await fetch('/notes', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const notes = await response.json();
            const notesList = document.getElementById('notes-list');
            notesList.innerHTML = '';
            notes.forEach(note => {
                const li = document.createElement('li');
                li.textContent = note.title || 'Untitled Note';
                li.onclick = () => openNote(note);
                notesList.appendChild(li);
            });
        } else {
            throw new Error('Failed to load notes');
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        alert('Error loading notes. Please try again.');
    }
}
// Login functionality
async function login(email, password) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email);
            updateUserAvatar(email);
            openTab(null, 'Notes');
        } else {
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    document.getElementById('user-avatar').style.display = 'none';
    openTab(null, 'Login');
}
function addTask() {
    const taskInput = document.getElementById('todo-input');
    const task = taskInput.value.trim();
    if (task) {
        const li = createTaskElement(task);
        document.getElementById('todo-list').appendChild(li);
        taskInput.value = '';
    }
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${task}</span>
        <div class="task-actions">
            <button class="task-complete" onclick="toggleComplete(this)">✓</button>
            <button class="task-delete" onclick="deleteTask(this)">×</button>
            <button class="task-collapse" onclick="toggleCollapse(this)">▼</button>
            <button class="task-expand" onclick="expandTask(this)">+</button>
        </div>
    `;
    return li;
}

function toggleComplete(button) {
    button.closest('li').classList.toggle('completed');
}

function deleteTask(button) {
    button.closest('li').remove();
}

function toggleCollapse(button) {
    const taskElement = button.closest('li');
    taskElement.classList.toggle('collapsed');
    button.textContent = taskElement.classList.contains('collapsed') ? '▶' : '▼';
}
function handleFileUpload(event) {
    const files = event.target.files;
    const previewArea = document.getElementById('file-preview');
    previewArea.innerHTML = '';

    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.createElement('div');
            preview.className = 'file-preview-item';
            preview.innerHTML = `
                <p>${file.name}</p>
                <pre>${e.target.result.substring(0, 100)}...</pre>
                <button onclick="uploadFile('${file.name}', '${e.target.result}')">Upload</button>
            `;
            previewArea.appendChild(preview);
        };
        reader.readAsText(file);
    }
}

function uploadFile(fileName, content) {
    // Here you would typically send the file to your server
    console.log(`Uploading file: ${fileName}`);
    document.getElementById('notes-input').value += `\n\n${content}`;
}

document.getElementById('file-upload').addEventListener('change', handleFileUpload);
function expandTask(button) {
    const taskElement = button.closest('li');
    const taskText = taskElement.querySelector('.task-text');
    const expandedText = prompt('Expand on this task:', taskText.textContent);
    if (expandedText) {
        taskText.textContent = expandedText;
    }
}
async function askQuestion() {
    const question = document.getElementById('question-input').value;
    const resultsElement = document.getElementById('qa-results');
    resultsElement.textContent = 'Generating answer...';
    try {
        const response = await fetch('/ask-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ query: question })
        });
        if (response.ok) {
            const data = await response.json();
            resultsElement.textContent = data.answer;
        } else {
            throw new Error('Failed to get answer');
        }
    } catch (error) {
        console.error('Error asking question:', error);
        resultsElement.textContent = 'Error getting answer. Please try again.';
    }
}

// Add event listener
document.getElementById('ask-question').addEventListener('click', askQuestion);
// Notes functionality
document.getElementById('summarize').addEventListener('click', summarizeNotes);
document.getElementById('save-notes').addEventListener('click', saveNotes);
document.getElementById('export-notes').addEventListener('click', exportNotes);
document.getElementById('convert-to-tasks').addEventListener('click', convertToTasks);

async function summarizeNotes() {
    const summaryElement = document.getElementById('summarized-notes');
    summaryElement.textContent = 'Summarizing...';
    const notes = document.getElementById('notes-input').value;
    try {
        const response = await fetch('/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ notes })
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('summarized-notes').innerText = data.summary;
        } else {
            throw new Error('Failed to summarize notes');
        }
    } catch (error) {
        console.error('Error summarizing notes:', error);
        alert('Error summarizing notes. Please try again.');
    }
}

async function saveNotes() {
    const notes = document.getElementById('notes-input').value;
    const summary = document.getElementById('summarized-notes').innerText;
    try {
        const response = await fetch('/save-note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ note: notes, summary })
        });
        if (response.ok) {
            alert('Notes saved successfully!');
        } else {
            throw new Error('Failed to save notes');
        }
    } catch (error) {
        console.error('Error saving notes:', error);
        alert('Error saving notes. Please try again.');
    }
}

function exportNotes() {
    const notes = document.getElementById('notes-input').value;
    const blob = new Blob([notes], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'notes.txt';
    a.click();
    URL.revokeObjectURL(a.href);
}

async function convertToTasks() {
    const summary = document.getElementById('summarized-notes').innerText;
    try {
        const response = await fetch('/extract-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ summary })
        });
        if (response.ok) {
            const data = await response.json();
            populateTodoList(data.tasks);
            openTab(null, 'ToDo');
        } else {
            throw new Error('Failed to extract tasks');
        }
    } catch (error) {
        console.error('Error converting to tasks:', error);
        alert('Error converting to tasks. Please try again.');
    }
}

function populateTodoList(tasks) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        todoList.appendChild(li);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    if (token && userEmail) {
        updateUserAvatar(userEmail);
        openTab(null, 'Notes');
    } else {
        openTab(null, 'Login');
    }
});

// Login form submission
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    login(email, password);
});

// Registration form submission (you'll need to implement the register function)
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    // Implement register function
});

// Voice input (you'll need to implement this feature)
document.getElementById('voice-input').addEventListener('click', () => {
    // Implement voice input functionality
});

// Image upload
document.getElementById('upload-image').addEventListener('click', () => {
    document.getElementById('imageModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('imageModal').style.display = 'none';
});

document.getElementById('upload-image-confirm').addEventListener('click', () => {
    // Implement image upload functionality
});

// Q&A functionality
document.getElementById('ask-question').addEventListener('click', async () => {
    const question = document.getElementById('question-input').value;
    try {
        const response = await fetch('/ask-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ query: question })
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('answer-display').innerText = data.answer;
        } else {
            throw new Error('Failed to get answer');
        }
    } catch (error) {
        console.error('Error asking question:', error);
        alert('Error getting answer. Please try again.');
    }
});

