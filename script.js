/* AI StudyMate - browser-based working prototype. No API key or server required. */
const STORAGE_KEY = "ai-studymate-tasks-v1";
const THEME_KEY = "ai-studymate-theme-v1";
const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskSummary = document.querySelector("#taskSummary");
const toast = document.querySelector("#toast");
let tasks = loadTasks();
let activeFilter = "all";
let toastTimer;

function loadTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored)
      ? stored.filter(
          (t) => t && typeof t.id === "string" && typeof t.title === "string",
        )
      : [];
  } catch (error) {
    return [];
  }
}
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    showToast("Could not save data. Check your browser storage settings.");
  }
}
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function getTotals() {
  const done = tasks.filter((t) => t.done).length;
  const minutes = tasks
    .filter((t) => !t.done)
    .reduce((sum, t) => sum + Number(t.minutes || 0), 0);
  return { done, pending: tasks.length - done, minutes };
}
function updateStats() {
  const { done, pending, minutes } = getTotals();
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  document.querySelector("#heroProgress").textContent = `${percent}%`;
  document.querySelector("#heroDone").textContent = done;
  document.querySelector("#heroPending").textContent = pending;
  document.querySelector(".progress-ring").style.background =
    `conic-gradient(var(--purple) ${percent * 3.6}deg, #ece9ff ${percent * 3.6}deg 360deg)`;
  document.querySelector("#statTasks").textContent = tasks.length;
  document.querySelector("#statCompleted").textContent = done;
  document.querySelector("#statMinutes").textContent = `${minutes} min`;
  document.querySelector("#statStreak").textContent = tasks.length
    ? `${percent}% done`
    : "Start today";
  taskSummary.textContent = `${pending} to do · ${done} completed`;
}
function renderTasks() {
  const filtered = tasks.filter(
    (t) =>
      activeFilter === "all" || (activeFilter === "done" ? t.done : !t.done),
  );
  if (!filtered.length) {
    const message = tasks.length
      ? "Nothing in this filter"
      : "Your plan starts here";
    const detail = tasks.length
      ? "Try another filter to see your tasks."
      : "Add your first task using the form.";
    taskList.innerHTML = `<div class="empty-state"><span>✎</span><h4>${message}</h4><p>${detail}</p></div>`;
  } else {
    taskList.innerHTML = filtered
      .map(
        (task) => `
      <article class="task-item ${task.done ? "is-done" : ""}">
        <input class="task-check" type="checkbox" aria-label="Mark ${escapeHTML(task.title)} completed" data-action="toggle" data-id="${task.id}" ${task.done ? "checked" : ""}>
        <div class="task-main"><strong>${escapeHTML(task.title)}</strong><div class="task-meta"><span class="subject-chip">${escapeHTML(task.subject)}</span><span>${Number(task.minutes)} min</span>${task.due ? `<span>Due ${escapeHTML(task.due)}</span>` : ""}</div></div>
        <button class="delete-task" type="button" aria-label="Delete ${escapeHTML(task.title)}" title="Delete task" data-action="delete" data-id="${task.id}">×</button>
      </article>`,
      )
      .join("");
  }
  updateStats();
}
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(taskForm);
  const title = String(formData.get("taskTitle") || "").trim();
  if (!title) {
    showToast("Please enter a task name.");
    return;
  }
  tasks.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    subject: String(formData.get("taskSubject") || "Other"),
    minutes: Number(formData.get("taskMinutes") || 25),
    due: String(formData.get("taskDue") || ""),
    done: false,
    createdAt: new Date().toISOString(),
  });
  saveTasks();
  activeFilter = "all";
  document
    .querySelectorAll(".filter")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.filter === "all"),
    );
  renderTasks();
  taskForm.reset();
  document.querySelector("#taskMinutes").value = "25";
  showToast("Task added to your study plan!");
});
taskList.addEventListener("change", (event) => {
  const control = event.target.closest('[data-action="toggle"]');
  if (!control) return;
  const task = tasks.find((item) => item.id === control.dataset.id);
  if (task) {
    task.done = control.checked;
    saveTasks();
    renderTasks();
    showToast(
      task.done ? "Nice work — task completed!" : "Task moved back to to-do.",
    );
  }
});
taskList.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="delete"]');
  if (!button) return;
  tasks = tasks.filter((task) => task.id !== button.dataset.id);
  saveTasks();
  renderTasks();
  showToast("Task deleted.");
});
document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document
      .querySelectorAll(".filter")
      .forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
  });
});
document.querySelector("#clearCompleted").addEventListener("click", () => {
  const before = tasks.length;
  tasks = tasks.filter((task) => !task.done);
  if (tasks.length === before) {
    showToast("There are no completed tasks to clear.");
    return;
  }
  saveTasks();
  renderTasks();
  showToast("Completed tasks cleared.");
});
const themeToggle = document.querySelector("#themeToggle");
function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light mode" : "Switch to dark mode",
  );
}
applyTheme(localStorage.getItem(THEME_KEY) === "dark");
themeToggle.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  applyTheme(dark);
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
});

// Small built-in AIML quiz: this is fixed sample content, not a generative AI service.
const quizQuestions = [
  {
    q: "What does AI stand for?",
    options: [
      "Automated Internet",
      "Artificial Intelligence",
      "Advanced Input",
      "Algorithm Integration",
    ],
    answer: 1,
    explanation: "AI stands for Artificial Intelligence.",
  },
  {
    q: "Which is a common supervised learning task?",
    options: [
      "Grouping without labels",
      "Predicting house prices from examples",
      "Randomly shuffling data",
      "Deleting duplicate files only",
    ],
    answer: 1,
    explanation:
      "Supervised learning uses labelled examples to learn predictions.",
  },
  {
    q: "What is a dataset?",
    options: [
      "A collection of data",
      "A type of monitor",
      "A programming language",
      "A network cable",
    ],
    answer: 0,
    explanation:
      "A dataset is an organized collection of data used for analysis or model training.",
  },
  {
    q: "Which metric is the proportion of correct predictions?",
    options: ["Latency", "Accuracy", "Memory size", "Epoch count"],
    answer: 1,
    explanation: "Accuracy is the fraction of predictions that are correct.",
  },
  {
    q: "Why split data into training and test sets?",
    options: [
      "To make files larger",
      "To evaluate performance on unseen examples",
      "To remove all labels",
      "To avoid cleaning data",
    ],
    answer: 1,
    explanation:
      "Test data helps estimate how well a model works on unseen examples.",
  },
];
let quizIndex = 0,
  selectedAnswer = null,
  answered = false,
  quizScore = 0;
const quizContent = document.querySelector("#quizContent");
const quizFeedback = document.querySelector("#quizFeedback");
const quizNext = document.querySelector("#quizNext");
function renderQuestion() {
  const item = quizQuestions[quizIndex];
  selectedAnswer = null;
  answered = false;
  document.querySelector("#quizCount").textContent =
    `QUESTION ${quizIndex + 1} OF ${quizQuestions.length}`;
  document.querySelector("#quizProgressBar").style.width =
    `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
  quizContent.innerHTML = `<h3 class="question-text">${escapeHTML(item.q)}</h3><div class="answers">${item.options.map((option, index) => `<button type="button" class="answer-option" data-answer="${index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span>${escapeHTML(option)}</button>`).join("")}</div>`;
  quizFeedback.textContent = "Choose the best answer.";
  quizNext.textContent = "Check answer";
  quizContent.querySelectorAll(".answer-option").forEach((button) =>
    button.addEventListener("click", () => {
      if (answered) return;
      selectedAnswer = Number(button.dataset.answer);
      quizContent
        .querySelectorAll(".answer-option")
        .forEach((option) =>
          option.classList.toggle("selected", option === button),
        );
      quizFeedback.textContent = "Answer selected — check when ready.";
    }),
  );
}
quizNext.addEventListener("click", () => {
  if (!answered) {
    if (selectedAnswer === null) {
      quizFeedback.textContent = "Select an answer first.";
      return;
    }
    answered = true;
    const item = quizQuestions[quizIndex];
    const correct = selectedAnswer === item.answer;
    if (correct) quizScore++;
    quizContent.querySelectorAll(".answer-option").forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add("correct");
      else if (index === selectedAnswer) button.classList.add("wrong");
    });
    quizFeedback.textContent = `${correct ? "Correct!" : "Not quite."} ${item.explanation}`;
    quizNext.textContent =
      quizIndex === quizQuestions.length - 1 ? "See result" : "Next question";
    return;
  }
  if (quizIndex < quizQuestions.length - 1) {
    quizIndex++;
    renderQuestion();
  } else {
    const percent = Math.round((quizScore / quizQuestions.length) * 100);
    quizContent.innerHTML = `<div class="empty-state"><span>✦</span><h4>Quiz complete!</h4><p>You scored ${quizScore} out of ${quizQuestions.length} (${percent}%). ${percent >= 80 ? "Great work — keep practising." : "Review the explanations and give it another try."}</p></div>`;
    quizFeedback.textContent = "You can repeat the quiz anytime.";
    quizNext.textContent = "Try again";
    quizNext.onclick = () => {
      quizIndex = 0;
      quizScore = 0;
      renderQuestion();
      quizNext.onclick = null;
    };
  }
});
renderTasks();
renderQuestion();
