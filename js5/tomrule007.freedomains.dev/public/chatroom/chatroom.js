function Todo(todo, container) {
  const element = document.createElement('div');
  container.append(element);
  element.innerHTML = `
  <section>
    <aside class='todo-container'></aside>
  </section>
  `;
  const date = new Date(todo.createdAt);
  const dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  let headerStr = `${todo.text} <small>${dateStr}</small>`;
  if (todo.complete) {
    headerStr = `<strike>${headerStr}</strike>`;
  }

  const todoContainer = element.querySelector('.todo-container');

  const renderNormal = () => {
    todoContainer.innerHTML = `
      <h1>${headerStr}</h1>
      <section>
      <button class="item-button edit">Edit</button>
      <button class="item-button delete">Delete</button>
      </section>
    `;
    const edit = todoContainer.querySelector('.edit');
    edit.addEventListener('click', renderEdit);
    const $h1 = todoContainer.querySelector('h1');
    $h1.addEventListener('click', () => {
      fetch(`https://js5.c0d3.com/todolist/api/todos/${todo.id}`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          complete: !todo.complete,
        }),
      }).then(render);
    });
    const $delete = todoContainer.querySelector('.delete');
    $delete.addEventListener('click', () => {
      fetch(`https://js5.c0d3.com/todolist/api/todos/${todo.id}`, {
        method: 'DELETE',
        credentials: 'include',
      }).then(render);
    });
  };
  const renderEdit = () => {
    todoContainer.innerHTML = `
      <input type="text" class="todo-edit-input" value="${todo.text}">
      <section>
      <button class="item-button cancel">Cancel</button>
      <button class="item-button save">Save</button>
      </section>
    `;
    const $cancel = todoContainer.querySelector('.cancel');
    $cancel.addEventListener('click', renderNormal);
    const $todoInput = todoContainer.querySelector('.todo-edit-input');
    const $save = todoContainer.querySelector('.save');
    $save.addEventListener('click', () => {
      fetch(`https://js5.c0d3.com/todolist/api/todos/${todo.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          text: $todoInput.value,
        }),
      }).then(render);
    });
  };
  renderNormal();
}

const render = () => {
  $appContainer.innerHTML = `
  <header>
    <h1>Todo List for ${globalUsername}</h1>
  </header>
  <div class="todolist">
  <section>
    <aside class='todo-container'>
      <input type="text" class="todo-edit-input" value="">
    </aside>
  </section>
  </div>
  `;
  const input = $appContainer.querySelector('.todo-edit-input');
  input.focus();
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      fetch('https://js5.c0d3.com/todolist/api/todos ', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          text: input.value,
        }),
      })
        .then((r) => {
          return r.json();
        })
        .then(render);
    }
  });

  const $todolist = $appContainer.querySelector('.todolist');
  // create a Todo object like this: new Todo(element, $todolist)

  fetch('https://js5.c0d3.com/todolist/api/todos', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((r) => r.json())
    .then((todos) => {
      todos.forEach((todo) => new Todo(todo, $todolist));
    });
};

let globalUsername;
const setupLogin = () => {
  $appContainer.innerHTML = `
    <h1>You must be logged in</h1>
    <p> No Account? You can
      <a href="#" class="instead">Sign up instead</a>
    </p>
    <input class="username" type="text" placeholder="username">
    <input class="password" type="password" placeholder="password">
    <button class="submit">Submit</button>
  `;
  const $username = document.querySelector('.username');
  const $password = document.querySelector('.password');
  const $instead = document.querySelector('.instead');
  const $submit = document.querySelector('.submit');
  $instead.addEventListener('click', () => {
    setupSignup();
  });
  $submit.addEventListener('click', () => {
    fetch('https://js5.c0d3.com/auth/api/sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: $username.value,
        password: btoa($password.value),
      }),
    })
      .then((r) => r.json())
      .then((body) => {
        if (body.username) {
          globalUsername = body.username;
          render();
        }
      });
  });
};

const setupSignup = () => {
  $appContainer.innerHTML = `
    <h1>New Account!</h1>
    <p> Already have an account? You can
      <a href="#" class="instead">Login instead</a>
    </p>
    <input class="name" type="text" placeholder="full name">
    <input class="username" type="text" placeholder="username">
    <input class="email" type="email" placeholder="email">
    <input class="password" type="password" placeholder="password" required minlength="5">
    <button class="submit">Submit</button>
  `;
  const $username = document.querySelector('.username');
  const $email = document.querySelector('.email');
  const $name = document.querySelector('.name');
  const $password = document.querySelector('.password');
  const $instead = document.querySelector('.instead');
  const $submit = document.querySelector('.submit');
  $instead.addEventListener('click', () => {
    setupLogin();
  });
  $submit.addEventListener('click', () => {
    console.log('clicky', atob($password.value));
    fetch('https://js5.c0d3.com/auth/api/users', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },

      body: JSON.stringify({
        username: $username.value,
        name: $name.value,
        email: $email.value,
        password: btoa($password.value),
      }),
    })
      .then((r) => r.json())
      .then((body) => console.log(body));
  });
};

const $appContainer = document.querySelector('.app-container');
const startApp = () => {
  fetch('https://js5.c0d3.com/auth/api/sessions', {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((body) => {
      if (body.error) setupLogin();
      if (body.username) {
        globalUsername = body.username;
        render();
      }
    });
};
startApp();
