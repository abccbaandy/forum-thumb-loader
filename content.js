//thread
// http:\/\/bbs\.soul-plus\.net\/thread\.php\?.*
// var imageSpaces = document.querySelectorAll(".tr3.t_one td a[title='打开新窗口']");
// var postUrls = document.querySelectorAll(".tr3.t_one td h3 a");
// var skipUrls = document.querySelectorAll(".tr3.t_one td img[title='置顶帖标志']");
// postImgUrl = #read_tpc.f14 img


//search
// http:\/\/bbs\.soul-plus\.net\/search\.php\?.*
// var imageSpaces = document.querySelectorAll("tr.tr3.tac th.y-style");
// var postUrls = document.querySelectorAll("tr.tr3.tac th.y-style a");
// var skipUrls = document.querySelectorAll("");
// postImgUrl = #read_tpc.f14 img

var imageSpaces;
var postUrls;
var skipUrls;
var thisTabUrl;
var postImgUrl;

function showThumbnail(img, imageSpacesIndex) {
    var tempImg = document.createElement('img');
    tempImg.src = img.src;
    tempImg.width = 200;
    tempImg.height = 200;
    imageSpaces[imageSpacesIndex].appendChild(tempImg);
}

function loadPostImg(imgsUrls, loadImgCount, imageSpacesIndex) {
    var img = new Image();
    img.src = imgsUrls[loadImgCount].src;
    img.onload = function() {

        //we only care the first valid image:)
        if (img.naturalWidth > 100 && img.naturalHeight > 100) {
            showThumbnail(img, imageSpacesIndex);
        } else {
            loadImgCount++;
            if (loadImgCount < imgsUrls.length) {
                loadPostImg(imgsUrls, loadImgCount, imageSpacesIndex);
            }
        }
    }
}

function getPostImg(responseText, imageSpacesIndex) {
    var result = new DOMParser().parseFromString(responseText, "text/html");

    var imgsUrls = result.querySelectorAll("#read_tpc.f14 img");
    // console.log("getPostImg imgsUrls length : " + imgsUrls.length);

    //check there is at least one image
    if (imgsUrls.length != 0) {
        //load "first image" first
        loadPostImg(imgsUrls, 0, imageSpacesIndex);
    }
}

function getAllMatchPost(postRegex) {
    imageSpaces = document.querySelectorAll(postRegex.imageSpaces);
    console.log("getAllMatchPost imageSpaces length : " + imageSpaces.length);
    postUrls = document.querySelectorAll(postRegex.postUrls);
    console.log("getAllMatchPost postUrls length : " + postUrls.length);
    if (postRegex.skipUrls == "") {
        skipUrls = [];
    } else {
        skipUrls = document.querySelectorAll(postRegex.skipUrls);
    }
    console.log("getAllMatchPost skipUrls length : " + skipUrls.length);
    
    
    for (var i = skipUrls.length; i < postUrls.length; i++) {

        //get post in background because it is very slow and make UI not response:(
        var worker = new Worker(chrome.runtime.getURL('getPost.js'));
        worker.onmessage = function(event) {
            var args = event.data.args;
            getPostImg(args[0], args[1]);
        };
        worker.postMessage({
            "args": [postUrls[i].href, i]
        });
    }
}

function getMatchListCallback(response) {
    console.log("response DB length: " + response.postRegexs.length);
    var postRegexs = response.postRegexs;
    for (var i = 0; i < postRegexs.length; i++) {
        var patt = new RegExp(postRegexs[i].matchUrl);
        console.log("postRegexs[" + i + "].matchUrl : " + postRegexs[i].matchUrl);
        console.log("postRegexs[" + i + "].matchUrl test: " + patt.test(thisTabUrl));
        if (patt.test(thisTabUrl)) {
            getAllMatchPost(postRegexs[i]);
        }
    };
}

function getThisTabUrlCallback(response) {
    console.log("response tab.url: " + response.url);
    thisTabUrl = response.url;

    //no really need to wait this callback, maybe move out of this func someday
    chrome.runtime.sendMessage({
        method: "getMatchList"
    }, getMatchListCallback);
}

//start here
chrome.runtime.sendMessage({
    method: "getThisTabUrl"
}, getThisTabUrlCallback);