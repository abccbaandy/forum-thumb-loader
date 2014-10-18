/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */


window.onload = function() {

  // Display the todo items.
  todoDB.open(refreshTodos);


  // Get references to the form elements.
  var newTodoForm = document.getElementById('new-todo-form');
  var matchUrl = document.getElementById('matchUrl');
  var imageSpaces = document.getElementById('imageSpaces');
  var postUrls = document.getElementById('postUrls');
  var skipUrls = document.getElementById('skipUrls');


  // Handle new todo item form submissions.
  newTodoForm.onsubmit = function() {
    // Get the todo text.
    var matchUrl_text = matchUrl.value;
    var imageSpaces_text = imageSpaces.value;
    var postUrls_text = postUrls.value;
    var skipUrls_text = skipUrls.value;


    // Create the todo item.
    todoDB.createTodo(matchUrl_text, imageSpaces_text, postUrls_text, skipUrls_text, function(todo) {
      refreshTodos();
    });

    // Reset the input field.
    newTodoInput.value = '';

    // Don't send the form.
    return false;
  };

}

// Update the list of todo items.
function refreshTodos() {
  todoDB.fetchTodos(function(todos) {
    var todoList = document.getElementById('todo-items');
    todoList.innerHTML = '<tr><th>Edit</th><th>Delete</th><th>matchUrl</th><th>imageSpaces</th><th>postUrls</th><th>skipUrls(Optional)</th></tr>';
    console.log("fetchTodos todos.length: " + todos.length);
    for (var i = 0; i < todos.length; i++) {
      // Read the todo items backwards (most recent first).
      var todo = todos[(todos.length - 1 - i)];

      var tr = document.createElement('tr');
      var td0 = document.createElement('td');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var td5 = document.createElement('td');

      var editBtn = document.createElement('input');
      editBtn.type = "button";
      editBtn.className = "editBtn";
      editBtn.value = "edit";
      editBtn.setAttribute("data-id", todo.timestamp);

      td0.appendChild(editBtn);

      var delBtn = document.createElement('input');
      delBtn.type = "button";
      delBtn.className = "todo-checkbox";
      delBtn.value = "delete";
      delBtn.setAttribute("data-id", todo.timestamp);

      td1.appendChild(delBtn);

      //var span = document.createElement('span');
      //span.innerHTML = todo.text;

      //td2.appendChild(span);

      td2.innerHTML = todo.matchUrl;
      td2.setAttribute('contenteditable', 'true');
      td3.innerHTML = todo.imageSpaces;
      td3.setAttribute('contenteditable', 'true');
      td4.innerHTML = todo.postUrls;
      td4.setAttribute('contenteditable', 'true');
      td5.innerHTML = todo.skipUrls;
      td5.setAttribute('contenteditable', 'true');

      tr.appendChild(td0);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      todoList.appendChild(tr);

      editBtn.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        var matchUrl_text;
        var imageSpaces_text;
        var postUrls_text;
        var skipUrls_text;
        var table = document.getElementById('todo-items');
        for (var i = 1; i < table.rows.length; i++) {
          if (table.rows[i].cells[0].childNodes[0].getAttribute('data-id') == id) {
            var row = table.rows[i];
            matchUrl_text = row.cells[2].innerHTML;
            imageSpaces_text = row.cells[3].innerHTML;
            postUrls_text = row.cells[4].innerHTML;
            skipUrls_text = row.cells[5].innerHTML;
          }
        }
        todoDB.updateTodo(matchUrl_text, imageSpaces_text, postUrls_text, skipUrls_text, id, refreshTodos);
      });

      delBtn.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        todoDB.deleteTodo(id, refreshTodos);
      });
    }

  });
}