let todoList = document.querySelector(".todo-list");

const todoForm = document.getElementById("todoForm");
const todoTableBody = document.getElementById("todoTableBody");
const searchInput = document.querySelector('[data-field="search"]');
let FormEL = document.querySelector(".create-form");

let twoEl = document.querySelector("#two");
console.log(twoEl);

// Formani yuborish (Vazifa qo'shish)
FormEL.addEventListener("submit", async (e) => {
  e.preventDefault();

  let formData = new FormData(FormEL);

  let newTodo = {
    title: formData.get("title"),
    description: formData.get("description"),
    completed: false,
  };

  await createTodo(newTodo);
  await getElement();
  FormEL.reset();
});

// Ma'lumotlarni serverdan olish
async function getElement() {
  try {
    let response = await fetch(
      "https://pythonanywhere.com",
      {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("malumot olishda xatolik");
    }
    let data = await response.json();

    updataUi(data.data.results);
    console.log(data.data.results);
    if (twoEl) {
      twoEl.textContent = data.data.results.length;
    }
  } catch (error) {
    console.log(error);
  }
}
getElement();

// Vazifani o'chirish
async function deletedTodo(id) {
  try {
    const response = await fetch(
      `https://pythonanywhere.com${id}/`,
      {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        }
      },
    );

    if (response.ok || response.status === 204) {
      await getElement();
    }
  } catch (error) {
    console.error("DELETE xato:", error);
  }
}

// UI (interfeys)ni yangilash
function updataUi(arr) {
  todoList.innerHTML = "";

  arr.forEach((todo) => {
    let { id, title, description, completed, created_at } = todo;
    let formattedDate = created_at ? created_at.split("T")[0] : "Noma'lum";

    todoList.innerHTML += `    <li class="todo-item" data-id="${id}" data-completed="${completed}">
              <button
                class="check"
                type="button"
                aria-label="Mark as completed"
                data-action="toggle"
              >
                <span class="check-icon" aria-hidden="true"></span>
              </button>

              <div class="todo-content">
                <div class="todo-top">
                  <h3 class="todo-title">${title}</h3>
                  <span class="badge badge-active">${completed ? "Done" : "Active"}</span>
                </div>
                <p class="todo-desc">
                ${description || ""}
                </p>

                <div class="meta">
                  <span class="meta-item">
                    <span class="meta-label">ID:</span>
                    <span class="meta-value">${id}</span>
                  </span>
                  <span class="meta-item">
                    <span class="meta-label">Created:</span>
                    <span class="meta-value">${formattedDate}</span>
                  </span>
                </div>
              </div>

              <div class="todo-actions">
                <button
                  class="icon-btn"
                  type="button"
                  title="Edit"
                  data-action="edit"
                >
                  ✎
                </button>
                <button
                  onclick="deletedTodo('${id}')"
                  class="icon-btn danger"
                  type="button"
                  title="Delete"
                  data-action="delete"
                >
                  🗑
                </button>
              </div>
            </li>`;
  });
}

// Yangi vazifa yaratish
async function createTodo(todo) {
  try {
    const response = await fetch(
      "https://pythonanywhere.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(todo),
      },
    );

    const data = await response.json();
    console.log("Server javobi:", data);
    alert(`${todo.title} qo'shildi`);
  } catch (error) {
    console.log(error);
  }
}

// Qidiruv tizimi
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();

  const allItems = todoList.querySelectorAll(".todo-item");
  allItems.forEach((li) => {
    const title = li.querySelector(".todo-title").textContent.toLowerCase();
    if (title.includes(q)) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  });
});
