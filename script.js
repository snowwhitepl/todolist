document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const emptyMessage = document.querySelector(".empty-list-message");
  const filterButtons = document.querySelectorAll(".filter");

  let tasks = [];

  function updateEmptyMessage() {
    emptyMessage.style.display = taskList.children.length === 0 ? "block" : "none";
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function createTaskElement(task) {
    const li = document.createElement("li");

    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      applyFilter();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete");
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      applyFilter();
    });

    // swipe do usunięcia
    let touchStartX = 0;
    let touchEndX = 0;

    li.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    li.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 100) {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        applyFilter();
      }
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
  }

  function applyFilter() {
    const activeFilter = document.querySelector(".filter.active").dataset.filter;
    taskList.innerHTML = "";

    tasks
      .filter(task => {
        if (activeFilter === "done") return task.done;
        if (activeFilter === "todo") return !task.done;
        return true;
      })
      .forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
      });

    updateEmptyMessage();
  }

  function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    applyFilter();
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      const task = {
        id: Date.now(),
        text: taskText,
        done: false
      };
      tasks.push(task);
      taskInput.value = "";
      saveTasks();

      document.querySelector(".filter.active").classList.remove("active");
      document.querySelector('[data-filter="all"]').classList.add("active");

      applyFilter();
    }
  });

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter.active").classList.remove("active");
      btn.classList.add("active");
      applyFilter();
    });
  });

  document.getElementById("export-btn").addEventListener("click", () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "zadania.json";
    link.click();

    URL.revokeObjectURL(url);
  });

  document.getElementById("import-file").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (!Array.isArray(importedTasks)) {
          alert("Nieprawidłowy format pliku.");
          return;
        }

        importedTasks.forEach((task) => {
          if (task.text && typeof task.done === "boolean") {
            tasks.push({
              id: Date.now() + Math.floor(Math.random() * 1000),
              text: task.text,
              done: task.done
            });
          }
        });

        saveTasks();
        applyFilter();
      } catch (err) {
        alert("Błąd podczas importu pliku.");
      }
    };

    reader.readAsText(file);
  });

  function displayCurrentDate() {
    const dateDisplay = document.getElementById("date-display");
    const now = new Date();
    const days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const months = [
      "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
      "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
    ];
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    dateDisplay.textContent = `${dayName}, ${day} ${month} ${year}`;
  }

  displayCurrentDate();
  loadTasks();
});