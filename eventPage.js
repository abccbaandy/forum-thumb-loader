var sendResponseLocal;

function dbOpenCallback() {
    matchPatternDB.readAll(function(matchPatterns) {
        console.log("read matchPatterns.length: " + matchPatterns.length);
        sendResponseLocal({
            matchPatterns: matchPatterns
        });
    });
}

function getThisTabUrlCallback(tab) {
    //console.log("tab.url : " + tab.url);
    sendResponseLocal({
        thisTabUrl: tab.url
    });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    sendResponseLocal = sendResponse;

    if (request.method == "getMatchPatterns") {
        matchPatternDB.open(dbOpenCallback);
        return true;
    } else if (request.method == "getThisTabUrl") {
        chrome.tabs.get(sender.tab.id, getThisTabUrlCallback);
        return true;
    } else
        sendResponse({}); // nothing to do:)

});