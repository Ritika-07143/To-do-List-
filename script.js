
/* ========================================
   1. MOTIVATIONAL QUOTES
======================================== */

const quotes = [
    {
        text: "Small steps still move you forward.",
        author: "A gentle reminder"
    },
    {
        text: "You do not have to do everything today. Just begin.",
        author: "A note to yourself"
    },
    {
        text: "Make room for the things that matter.",
        author: "A little wisdom"
    },
    {
        text: "Progress, not perfection.",
        author: "A reminder for today"
    },
    {
        text: "Your future self will thank you for starting.",
        author: "A thought to keep"
    },
    {
        text: "One thing at a time. One day at a time.",
        author: "A gentle reminder"
    },
    {
        text: "Give yourself the same patience you give others.",
        author: "A note to yourself"
    },
    {
        text: "You are allowed to grow at your own pace.",
        author: "A little wisdom"
    },
    {
        text: "A fresh start can begin with one small decision.",
        author: "A thought to keep"
    },
    {
        text: "Some days, showing up is enough.",
        author: "A reminder for today"
    }
];


/* ========================================
   2. SELECT HTML ELEMENTS
======================================== */

const quoteScreen = document.getElementById("quote-screen");
const todoScreen = document.getElementById("todo-screen");

const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");

const nextQuoteBtn = document.getElementById("next-quote-btn");
const beginBtn = document.getElementById("begin-btn");
const backBtn = document.getElementById("back-btn");

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");


/* ========================================
   3. DISPLAY A RANDOM QUOTE
======================================== */

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);

    const selectedQuote = quotes[randomIndex];

    quoteText.textContent = selectedQuote.text;
    quoteAuthor.textContent = "— " + selectedQuote.author;
}

// Show a quote when the website opens
showRandomQuote();

// Show another quote when the button is clicked
nextQuoteBtn.addEventListener("click", showRandomQuote);


/* ========================================
   4. JOURNAL OPENING ANIMATION
======================================== */

function openJournal() {
    quoteScreen.classList.add("opening");

    setTimeout(() => {
        quoteScreen.classList.add("hidden");
        quoteScreen.classList.remove("opening");

        todoScreen.classList.remove("hidden");
        todoScreen.classList.add("opening");

        setTimeout(() => {
            todoScreen.classList.remove("opening");
        }, 650);

        todoInput.focus();
    }, 450);
}

function closeJournal() {
    todoScreen.classList.add("opening");

    setTimeout(() => {
        todoScreen.classList.add("hidden");
        todoScreen.classList.remove("opening");

        quoteScreen.classList.remove("hidden");
        quoteScreen.classList.add("opening");

        setTimeout(() => {
            quoteScreen.classList.remove("opening");
        }, 650);
    }, 350);
}

beginBtn.addEventListener("click", openJournal);
backBtn.addEventListener("click", closeJournal);


/* ========================================
   5. LOAD SAVED TASKS
======================================== */

let tasks = [];

try {
    const savedTasks = localStorage.getItem("softAcademiaTasks");

    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
            tasks = parsedTasks.filter(task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            );
        }
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}


/* ========================================
   6. SAVE TASKS
======================================== */

function saveTasks() {
    try {
        localStorage.setItem("softAcademiaTasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Could not save tasks:", error);
    }
}


/* ========================================
   7. UPDATE TASK COUNTER
======================================== */

function updateTaskCount() {
    const remainingTasks = tasks.filter(task => !task.completed).length;

    if (remainingTasks === 1) {
        taskCount.textContent = "1 little thing remaining";
    } else {
        taskCount.textContent = remainingTasks + " little things remaining";
    }
}


/* ========================================
   8. DISPLAY TASKS
======================================== */

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const listItem = document.createElement("li");

        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Create the completion checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as completed");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();
        });

        // Create the task text
        const taskText = document.createElement("span");

        taskText.textContent = task.text;

        // Create the delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.type = "button";
        deleteBtn.textContent = "Remove";
        deleteBtn.setAttribute("aria-label", "Delete task: " + task.text);

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);

            saveTasks();
            renderTasks();
        });

        listItem.append(checkbox, taskText, deleteBtn);
        taskList.appendChild(listItem);
    });

    updateTaskCount();
}


/* ========================================
   9. ADD A NEW TASK
======================================== */

todoForm.addEventListener("submit", event => {
    event.preventDefault();

    const taskText = todoInput.value.trim();

    // Do not add an empty task
    if (taskText === "") {
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    // Clear the input for the next task
    todoInput.value = "";
    todoInput.focus();
});


/* ========================================
   10. INITIALIZE THE TASK LIST
======================================== */

renderTasks();
