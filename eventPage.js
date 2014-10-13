var sendResponseLocal;

function dbOpenCallback() {
    console.log("dbOpenCallback : " + todoDB);
    todoDB.fetchTodos(function (todos) {
    	console.log("fetchTodos todos.length: " + todos.length);
    	//sendResponseLocal({data: "666"});
        sendResponseLocal({data: todos});
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getData") {
    	sendResponseLocal = sendResponse;
    	todoDB.open(dbOpenCallback);
    	//sendResponseLocal({data: "999"});
    	/*todoDB.open(function () {
    		console.log("dbOpenCallback : " + todoDB);
    		todoDB.fetchTodos(function (todos) {
    			console.log("fetchTodos todos.length: " + todos.length);
    			sendResponse({data: "666"});
    		});
		});*/
        return true;
    }
    else
      sendResponse({}); // snub them.
});