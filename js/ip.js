(function () {
  const POSTS_API = "https://jsonplaceholder.typicode.com/posts";
  let currentPage = 1;
  let limit = 5;
  let totalPostsCount = 100;

  const limitInput = document.getElementById("limitInput");
  const fetchBtn = document.getElementById("fetchBtn");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const postsContainer = document.getElementById("postsContainer");

  async function fetchPosts(page, limit) {
    try {
      const response = await fetch(
        `${POSTS_API}?_page=${page}&_limit=${limit}`,
      );
      if (!response.ok) throw new Error("Помилка завантаження");
      const total = response.headers.get("X-Total-Count");
      if (total) totalPostsCount = parseInt(total);
      return await response.json();
    } catch (err) {
      Notiflix.Notify.failure(`Помилка: ${err.message}`);
      return [];
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (m) {
      if (m === "&") return "&amp;";
      if (m === "<") return "&lt;";
      if (m === ">") return "&gt;";
      return m;
    });
  }

  function renderPosts(posts, append = false) {
    if (!append) postsContainer.innerHTML = "";
    if (posts.length === 0 && !append) {
      postsContainer.innerHTML =
        '<div class="info-placeholder">Немає замовлень</div>';
      return;
    }
    posts.forEach((post) => {
      const div = document.createElement("div");
      div.className = "post-item";
      div.innerHTML = `
        <div class="post-title">📌 ${escapeHtml(post.title)}</div>
        <div class="post-body">${escapeHtml(post.body)}</div>
        <small>ID: ${post.id}</small>
      `;
      postsContainer.appendChild(div);
    });
  }

  async function handleFirstFetch() {
    const rawLimit = limitInput.value.trim();
    if (rawLimit === "") {
      Notiflix.Notify.warning("Введіть кількість замовлень");
      return;
    }
    const newLimit = Number(rawLimit);
    if (isNaN(newLimit) || newLimit <= 0) {
      Notiflix.Notify.warning("Введіть додатнє число");
      return;
    }
    limit = newLimit;
    currentPage = 1;
    postsContainer.innerHTML =
      '<div class="info-placeholder">Завантаження...</div>';
    const posts = await fetchPosts(currentPage, limit);
    if (posts.length === 0) {
      postsContainer.innerHTML =
        '<div class="info-placeholder">Немає даних</div>';
      loadMoreBtn.style.display = "none";
      return;
    }
    renderPosts(posts, false);
    loadMoreBtn.style.display = "block";
    loadMoreBtn.textContent = `Інші замовлення (стор. ${currentPage + 1})`;
    const maxPages = Math.ceil(totalPostsCount / limit);
    if (currentPage >= maxPages) loadMoreBtn.style.display = "none";
  }

  async function handleLoadMore() {
    const maxPages = Math.ceil(totalPostsCount / limit);
    if (currentPage + 1 > maxPages) {
      Notiflix.Notify.warning("Більше немає даних для завантаження");
      loadMoreBtn.style.display = "none";
      return;
    }
    const nextPage = currentPage + 1;
    const newPosts = await fetchPosts(nextPage, limit);
    if (newPosts.length === 0) {
      Notiflix.Notify.warning("Відсутні дані");
      return;
    }
    renderPosts(newPosts, true);
    currentPage = nextPage;
    loadMoreBtn.textContent = `Інші замовлення (стор. ${currentPage + 1})`;
    if (currentPage >= maxPages) {
      loadMoreBtn.style.display = "none";
      Notiflix.Notify.info("Усі замовлення завантажено");
    }
  }

  if (fetchBtn) fetchBtn.addEventListener("click", handleFirstFetch);
  if (loadMoreBtn) loadMoreBtn.addEventListener("click", handleLoadMore);

  const TODOS_API = "https://jsonplaceholder.typicode.com/todos";
  let allTasks = [];
  let currentFilter = "all";
  const tasksContainer = document.getElementById("tasksContainer");
  const newTaskInput = document.getElementById("newTaskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const filterBtns = document.querySelectorAll(".filter-btn");

  async function fetchTasksFromAPI() {
    try {
      const response = await fetch(TODOS_API);
      if (!response.ok) throw new Error();
      const tasks = await response.json();
      return tasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
      }));
    } catch {
      Notiflix.Notify.failure("Не вдалося завантажити замовлення");
      return [];
    }
  }

  function renderTasks() {
    let filtered = [];
    if (currentFilter === "all") filtered = [...allTasks];
    if (currentFilter === "active")
      filtered = allTasks.filter((t) => !t.completed);
    if (currentFilter === "completed")
      filtered = allTasks.filter((t) => t.completed);

    if (filtered.length === 0) {
      tasksContainer.innerHTML =
        '<div class="info-placeholder">Немає замовлень</div>';
      return;
    }

    tasksContainer.innerHTML = "";
    filtered.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item";
      taskDiv.dataset.id = task.id;
      taskDiv.innerHTML = `
        <div class="task-title">
          <div class="task-text">
            <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
            <span class="${task.completed ? "completed" : ""}">${escapeHtml(task.title)}</span>
          </div>
          <button class="delete-task" data-id="${task.id}">Видалити</button>
        </div>
      `;
      tasksContainer.appendChild(taskDiv);
    });

    document.querySelectorAll(".task-checkbox").forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const id = parseInt(e.target.dataset.id);
        const task = allTasks.find((t) => t.id === id);
        if (task) {
          task.completed = !task.completed;
          renderTasks();
          Notiflix.Notify.success(
            `Замовлення ${task.completed ? "виконано" : "не виконано"} `,
          );
        }
      });
    });

    document.querySelectorAll(".delete-task").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = parseInt(e.target.dataset.id);
        try {
          await fetch(`${TODOS_API}/${id}`, { method: "DELETE" });
        } catch (e) {}
        allTasks = allTasks.filter((t) => t.id !== id);
        renderTasks();
        Notiflix.Notify.success("Замовлення видалено");
      });
    });
  }

  async function addNewTask() {
    const title = newTaskInput.value.trim();
    if (!title) {
      Notiflix.Notify.warning("Введіть текст замовлення");
      return;
    }
    const tempId = Date.now();
    const newTask = { id: tempId, title, completed: false };

    try {
      const response = await fetch(TODOS_API, {
        method: "POST",
        body: JSON.stringify({ title, completed: false, userId: 1 }),
        headers: { "Content-type": "application/json" },
      });
      const data = await response.json();
      if (data && data.id) newTask.id = data.id;
      Notiflix.Notify.success("Замовлення додано");
    } catch (e) {
      Notiflix.Notify.warning("Додано локально");
    }
    allTasks.unshift(newTask);
    newTaskInput.value = "";
    renderTasks();
  }

  async function initTaskManager() {
    tasksContainer.innerHTML =
      '<div class="info-placeholder">Завантаження...</div>';
    const tasks = await fetchTasksFromAPI();
    allTasks = tasks;
    renderTasks();
  }

  if (addTaskBtn) addTaskBtn.addEventListener("click", addNewTask);
  if (newTaskInput)
    newTaskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addNewTask();
    });
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
  initTaskManager();
})();
