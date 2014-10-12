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
  var imageSpaces = document.getElementById('imageSpaces');
  var postUrls = document.getElementById('postUrls');
  var skipUrls = document.getElementById('skipUrls');
  
  
  // Handle new todo item form submissions.
  newTodoForm.onsubmit = function() {
    // Get the todo text.
    var imageSpaces_text = imageSpaces.value;
    var postUrls_text = postUrls.value;
    var skipUrls_text = skipUrls.value;
    

      // Create the todo item.
      todoDB.createTodo(imageSpaces_text, postUrls_text, skipUrls_text, function(todo) {
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
    todoList.innerHTML = '<tr><th>XXXX</th><th>imageSpaces</th><th>postUrls</th><th>skipUrls</th></tr>';
    
    for(var i = 0; i < todos.length; i++) {
      // Read the todo items backwards (most recent first).
      var todo = todos[(todos.length - 1 - i)];

      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.setAttribute("data-id", todo.timestamp);
      
      td1.appendChild(checkbox);
      
      //var span = document.createElement('span');
      //span.innerHTML = todo.text;
      
      //td2.appendChild(span);
      td2.innerHTML = todo.imageSpaces;
      td3.innerHTML = todo.postUrls;
      td4.innerHTML = todo.skipUrls;
      
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      todoList.appendChild(tr);
      
      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        todoDB.deleteTodo(id, refreshTodos);
      });
    }

  });
}



