//thread
// http:\/\/bbs\.soul-plus\.net\/thread\.php\?.*
// var imageSpaces = document.querySelectorAll(".tr3.t_one td a[title='打开新窗口']");
// var postUrls = document.querySelectorAll(".tr3.t_one td h3 a");
// var skipUrls = document.querySelectorAll(".tr3.t_one td img[title='置顶帖标志']");
// postImgUrlPattern = #read_tpc.f14 img


//search
// http:\/\/bbs\.soul-plus\.net\/search\.php\?.*
// var imageSpaces = document.querySelectorAll("tr.tr3.tac th.y-style");
// var postUrls = document.querySelectorAll("tr.tr3.tac th.y-style a");
// var skipUrls = document.querySelectorAll("");
// postImgUrlPattern = #read_tpc.f14 img

var imageSpaces;
var postUrls;
var skipUrls;
var thisTabUrl;
var postImgUrlPattern;

function showPostThumbnail(img, postIndex) {
    var tempImg = document.createElement('img');
    tempImg.src = img.src;
    tempImg.width = 200;
    tempImg.height = 200;
    imageSpaces[postIndex].appendChild(tempImg);
}

function loadPostImg(imgsUrls, loadImgCount, postIndex) {
    var img = new Image();
    img.src = imgsUrls[loadImgCount].src;
    img.onload = function() {

        //we only care the first valid image:)
        if (img.naturalWidth > 100 && img.naturalHeight > 100) {
            showPostThumbnail(img, postIndex);
        } else {
            loadImgCount++;
            if (loadImgCount < imgsUrls.length) {
                loadPostImg(imgsUrls, loadImgCount, postIndex);
            }
        }
    }
}

function getPostImg(responseText, postIndex) {
    var result = new DOMParser().parseFromString(responseText, "text/html");
    var imgsUrls = result.querySelectorAll(postImgUrlPattern);
    // console.log("getPostImg imgsUrls length : " + imgsUrls.length);

    if (imgsUrls.length != 0) {
        loadPostImg(imgsUrls, 0, postIndex);
    }
}

function workerCallback(event) {
    var args = event.data.args;
    getPostImg(args[0], args[1]);
}

function getAllMatchPosts(matchPattern) {
    postImgUrlPattern = matchPattern.postImgUrl;
    imageSpaces = document.querySelectorAll(matchPattern.imageSpaces);
    // console.log("getAllMatchPosts imageSpaces length : " + imageSpaces.length);
    postUrls = document.querySelectorAll(matchPattern.postUrls);
    // console.log("getAllMatchPosts postUrls length : " + postUrls.length);

    if (matchPattern.skipUrls == "") {
        //no need to skip anything
        skipUrls = [];
    } else {
        skipUrls = document.querySelectorAll(matchPattern.skipUrls);
    }
    // console.log("getAllMatchPosts skipUrls length : " + skipUrls.length);

    for (var i = skipUrls.length; i < postUrls.length; i++) {
        //get post in background because it is very slow and make UI not response:(
        var worker = new Worker(chrome.runtime.getURL('getPost.js'));
        worker.onmessage = workerCallback;
        worker.postMessage({
            "args": [postUrls[i].href, i]
        });
    }
}

function getMatchPatternsCallback(response) {
    // console.log("getMatchPatternsCallback matchPatterns length: " + response.matchPatterns.length);
    var matchPatterns = response.matchPatterns;
    for (var i = 0; i < matchPatterns.length; i++) {
        var pattern = new RegExp(matchPatterns[i].tabUrl);
        // console.log("matchPatterns[" + i + "].tabUrl : " + matchPatterns[i].tabUrl);
        // console.log("matchPatterns[" + i + "].tabUrl test: " + pattern.test(thisTabUrl));
        if (pattern.test(thisTabUrl)) {
            getAllMatchPosts(matchPatterns[i]);
        }
    }
}

function getThisTabUrlCallback(response) {
    // console.log("getThisTabUrlCallback thisTabUrl: " + response.thisTabUrl);
    thisTabUrl = response.thisTabUrl;

    //no really need to wait this callback, maybe move out of this func someday
    chrome.runtime.sendMessage({
        method: "getMatchPatterns"
    }, getMatchPatternsCallback);
}

//start here
chrome.runtime.sendMessage({
    method: "getThisTabUrl"
}, getThisTabUrlCallback);