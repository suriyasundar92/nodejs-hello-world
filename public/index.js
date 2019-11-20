window.onload = async function() {
  document.getElementById("search-button").addEventListener('click', (e) => {
    const term = document.getElementById("search-input").value;
    fetch(`search?term=${term}`, { method: 'GET' }).then((response) => {
      response.json().then((tasks) => {
        document.getElementById("results").innerHTML = getTaskListComponent(tasks);
      });
    });
  });
};

function getTaskListComponent(tasks) {
  return '<h2>Results:</h2>' + tasks.reduce((innerHtml, task) => {
    return innerHtml + getTaskComponent(task);
  }, '');
}

function getTaskComponent(task) {
  return `<div class="task"><div class="title">Title: ${task.title}</div><div>Description: ${task.description}</div></div>`
}
