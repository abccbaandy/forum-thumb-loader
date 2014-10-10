var imageSpaces = document.querySelectorAll(".tr3.t_one td a[title='打开新窗口']");
var postUrls = document.querySelectorAll(".tr3.t_one td h3 a");
var skipUrls = document.querySelectorAll(".tr3.t_one td img[title='置顶帖标志']");

function showImg(img, imageSpacesIndex) {
    var tempImg = document.createElement('img');
    tempImg.src = img.src;
    tempImg.width = 200;
    tempImg.height = 200;
    imageSpaces[imageSpacesIndex].appendChild(tempImg);
}

function loadImg(imgsUrls, loadImgCount, imageSpacesIndex) {
    var img = new Image();
    img.src = imgsUrls[loadImgCount].src;
    img.onload = function() {

        //we only care the first valid image:)
        if(img.naturalWidth>100&&img.naturalHeight>100) {
            showImg(img, imageSpacesIndex);
            //postMessage(img.src);
        }
        else {
            loadImgCount++;
            if(loadImgCount<imgsUrls.length) {
                loadImg(imgsUrls, loadImgCount, imageSpacesIndex);
            }
        }
    }
}

function getImg (responseText, imageSpacesIndex) {
    var result = new DOMParser().parseFromString(responseText, "text/html");    

    var imgsUrls = result.querySelectorAll("#read_tpc.f14 img");

    //check there is at least one image
    if(imgsUrls.length!=0) {
        var loadImgCount = 0;
        loadImg(imgsUrls, loadImgCount, imageSpacesIndex);
    }
}

for (var i = skipUrls.length; i < postUrls.length; i++) { 
//for (var i = skipUrls.length; i < skipUrls.length+5; i++) { 
    //httpGet(postUrls[i].href, i);
    var worker = new Worker(chrome.runtime.getURL('imageLoader.js'));
    worker.onmessage = function(event) {
        var args = event.data.args;
        getImg(args[0], args[1]);
    };
    worker.postMessage({"args":[postUrls[i].href, i]});
}
