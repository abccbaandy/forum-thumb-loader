var sendResponseLocal;

function dbOpenCallback() {
    todoDB.fetchTodos(function(todos) {
        console.log("fetchTodos todos.length: " + todos.length);
        sendResponseLocal({
            postRegexs: todos
        });
    });
}

function getThisTabUrlCallback(tab) {
    console.log("tab.url : " + tab.url);
    sendResponseLocal({
        url: tab.url
    });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    sendResponseLocal = sendResponse;

    if (request.method == "getMatchList") {
        todoDB.open(dbOpenCallback);
        return true;
    } else if (request.method == "getThisTabUrl") {
        chrome.tabs.get(sender.tab.id, getThisTabUrlCallback);
        return true;
    } else
        sendResponse({}); // nothing to do:)

});