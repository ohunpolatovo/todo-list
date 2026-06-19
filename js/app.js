const todoWrapEl = document.querySelector(".todo-list");
const FormEl = document.querySelector('.create-form');
console.log(FormEl);

const Base_url = "https://biyovo1194.pythonanywhere.com/api/v1/tasks/";

FormEl.addEventListener('submit', (e) => {
  e.preventDefault();

  let formData = new FormData(FormEl);

  let newTodo = {
    title: formData.get("title"),
    description: formData.get("description"),
    completed: false,
  };
  postTodo(newTodo);
  getTodos()
});


// 1. Todo olish (GET)
async function getTodos() {
  try {
    let response = await fetch(Base_url);

    if (!response.ok) {
      throw new Error("api kelmadi");
    }

    let data = await response.json();
    UpdateUi(data.data.results);
    console.log(data.data.results);

  } catch (error) {
    console.log(error);
  }
}
getTodos();


function UpdateUi(arr) {
  todoWrapEl.innerHTML = "";
  
  if (!arr || arr.length === 0) {
    todoWrapEl.innerHTML = "<li>Todo-lar mavjud emas.</li>";
    return;
  }

  arr.forEach(todo => {
    console.log(todo);
    let { id, title, description, completed, created_at } = todo;

    let formattedDate = created_at ? created_at.split("T")[0] : "Sana yo'q";

    todoWrapEl.innerHTML += `
    <li class="todo-item" data-id="${id}" data-completed="${completed}"> 
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
                  <h3 class="todo-title">${title || "Sarlavhasiz"}</h3>
                  <span class="badge ${completed ? 'badge-completed' : 'badge-active'}">${completed ? "Done" : "Active"}</span>
                </div>
                <p class="todo-desc">
                  ${description || "Tavsif yo'q"}
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
                  onclick="deleteTodo(${id})"
                  class="icon-btn danger"
                  type="button"
                  title="Delete"
                  data-action="delete"
                >
                  🗑
                </button>
              </div>
            </li>  
    `;
  });
}



async function deleteTodo(id) {
  console.log("O'chirilayotgan ID:", id);
  try {
    let response = await fetch(`${Base_url}${id}/`, {
      method: 'DELETE',
    });

    if (response.status === 200 || response.status === 204) {
      alert(`Todo ${id} ochirildi`);
      getTodos(); 
    } else {
      alert(`O'chirishda xatolik: Server ${response.status} javobini qaytardi`);
    }
  } catch (error) {
    console.log(`Todo ${id} ochirishda muammo bor`, error);
  }
}


// 4. Todo qo'shish (POST)
async function postTodo(todo) {
  console.log("Yuborilayotgan ma'lumot:", todo);

  try {
    let response = await fetch(Base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo)
    });

    if (!response.ok) {
      throw new Error("Ma'lumot saqlanmadi");
    }

    const data = await response.json();
    console.log("Qo'shildi:", data);
    
    FormEl.reset(); 
    getTodos(); 

  } catch (error) {
    console.log(error);
  }
}
