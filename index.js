const lista = document.getElementById("lista");
const inputDescricao = document.getElementById("inputDescricao");
const btAdd = document.getElementById("btAdd");

const taskUrl = "https://parseapi.back4app.com/classes/Task";
const headers = {
  "X-Parse-Application-Id": "RkjwBkfNZRERi3k4FVjojkTgLLe6CbbTPbW4qrQo",
  "X-Parse-REST-API-Key": "wmn69SVNaLq6UoW177InOj1tnXUsy2fkfvtHagdu",
};

const renderizaLista = (lista, tarefas) => {
  lista.innerHTML = "";
  tarefas.forEach((tarefa) => {
    const itemText = document.createTextNode(tarefa.description);
    const listItem = document.createElement("li");
    
    // Alteração: Adiciona a classe "task-done" se a tarefa estiver concluída
    if (tarefa.done) {
      listItem.classList.add("task-done");
    }

    // Alteração: Substitui o botão "DONE" por um checkbox
    const checkboxDone = document.createElement("input");
    checkboxDone.type = "checkbox";
    checkboxDone.checked = tarefa.done;
    checkboxDone.onchange = () => updateTask(tarefa);
    
    const buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = "X";
    buttonDelete.onclick = () => deleteTask(tarefa.objectId);
    
    listItem.appendChild(checkboxDone);
    listItem.appendChild(itemText);
    listItem.appendChild(buttonDelete);
    lista.appendChild(listItem);
  });
};

const getTasks = () => {
  fetch(taskUrl, { headers: headers })
    .then((res) => res.json())
    .then((data) => {
      renderizaLista(lista, data.results);
    });
};

const handleBtAddClick = () => {
  const description = inputDescricao.value;
  if (!description) {
    alert("É necessário digitar uma descrição!");
    return;
  }
  btAdd.disabled = true;
  fetch(taskUrl, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description: description }),
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      btAdd.disabled = false;
      inputDescricao.value = "";
      inputDescricao.focus();
      console.log("data", data);
    })
    .catch((err) => {
      btAdd.disabled = false;
      console.log(err);
    });
};

const deleteTask = (id) => {
  fetch(`${taskUrl}/${id}`, {
    method: "DELETE",
    headers: headers,
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      console.log("data", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateTask = (task) => {
  fetch(`${taskUrl}/${task.objectId}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ done: !task.done }),
  })
    .then((res) => res.json())
    .then((data) => {
      getTasks();
      console.log("data", data);
    })
    .catch((err) => {
      console.log(err);
    });
};

getTasks();

btAdd.onclick = handleBtAddClick;