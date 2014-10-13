var sendResponseLocal;

function dbOpenCallback() {
    console.log("dbOpenCallback : " + todoDB);
    todoDB.fetchTodos(function (todos) {
    	console.log("fetchTodos todos.length: " + todos.length);
        sendResponseLocal({data: todos});
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getData") {
    	sendResponseLocal = sendResponse;
    	todoDB.open(dbOpenCallback);
        return true;
    }
    else
      sendResponse({}); // nothing to do:)
});