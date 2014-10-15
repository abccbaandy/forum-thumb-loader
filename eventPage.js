var sendResponseLocal;

function dbOpenCallback() {
    console.log("dbOpenCallback : " + todoDB);
    todoDB.fetchTodos(function (todos) {
    	console.log("fetchTodos todos.length: " + todos.length);
        sendResponseLocal({data: todos});
    });
}

function getTabUrlCallback(tab) {
    console.log("tab.url : " + tab.url);
    sendResponseLocal({url: tab.url});
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getData") {
    	sendResponseLocal = sendResponse;
    	todoDB.open(dbOpenCallback);
        return true;
    }
    else if (request.method == "getTabUrl") {
        sendResponseLocal = sendResponse;
        chrome.tabs.get(sender.tab.id, getTabUrlCallback);
        return true;
    }
    else
      sendResponse({}); // nothing to do:)
});