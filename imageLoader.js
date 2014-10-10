var imageSpaces = document.querySelectorAll(".tr3.t_one td a[title='打开新窗口']");
var imageUrls = document.querySelectorAll(".tr3.t_one td h3 a");
var skipUrls = document.querySelectorAll(".tr3.t_one td img[title='置顶帖标志']");

function showImg(img, imageSpacesIndex) {
    //console.log("imgs[0].width : "+imgs[0].width);
    //var firstValidImg;
    //firstValidImg = imgsData[0];
    //console.log("firstValidImg.width : "+firstValidImg.width);
    /*
    for (var i = 0; i < imgsData.length; i++) {
        console.log("imgsData[i].naturalWidth : "+ i + " "+imgsData[i].naturalWidth);
        //if((imgs[i].naturalWidth>100)&&(imgs[i].naturalHeight>100)) {
            if(imgsData[i].naturalWidth>100) {
                firstValidImg = imgsData[i];
                break;
            }
    }
    */
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
        /*console.log("img.naturalWidth : "+img.naturalWidth+
        "\nimg.naturalHeight : "+img.naturalHeight+
        "\nimageSpacesIndex : "+imageSpacesIndex+
        "\nloadImgCount : " +loadImgCount+
        "\nimg.src : " +img.src
        );*/
        //imgsData[loadImgCount] = img;
        
        if(img.naturalWidth>100&&img.naturalHeight>100) {
            showImg(img, imageSpacesIndex);
        }        
        /*else if(loadImgCount==0) {
            showImg(imgsData, imageSpacesIndex);
        }*/
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
    /*
    var imgsA = result.querySelectorAll("#read_tpc.f14 a img");
    var imgsB = result.querySelectorAll("#read_tpc.f14 img");
    if (imgsA.length==0) {
        //imgsA=imgsB;
        imgsA = "[<img src=\"images/post/smile/smallface/face110.jpg\">]";
    };
    if (imgsB.length==0) {
        //imgsB=imgsA;
        imgsB = "[<img src=\"images/post/smile/smallface/face110.jpg\">]";
    };
    var imgA = getFirstValidImg(imgsA);
    var imgB = getFirstValidImg(imgsB);
    var img;
    
    if (imgA.naturalHeight>=imgB.naturalHeight) {
        img = imgA;
    } else {
        img = imgB;
    }
    */
    
    /*
    var img = getFirstValidImg(result.querySelectorAll("#read_tpc.f14 img"));
    var tempImg = document.createElement('img');
	tempImg.src = img.src;
	tempImg.width = 200;
	tempImg.height = 200;
	imageSpaces[imageSpacesIndex].appendChild(tempImg);
    */
    var imgsUrls = result.querySelectorAll("#read_tpc.f14 img");
    var loadImgCount = 0;// = imgsUrls.length-1;
    //var imgsData = [];
    //loadImg(imgsUrls, loadImgCount, imgsData, imageSpacesIndex);
    loadImg(imgsUrls, loadImgCount, imageSpacesIndex);
}


function httpGet(theUrl, showImgIndex)
{
	xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        	getImg(xmlhttp.responseText, showImgIndex);
            //return xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();    
}

for (var i = skipUrls.length; i < imageUrls.length; i++) { 
//for (var i = skipUrls.length+16; i < skipUrls.length+25; i++) { 
	//httpGet("http://bbs.soul-plus.net/read.php?tid-100758.html", i);
	httpGet(imageUrls[i].href, i);
}