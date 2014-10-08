var imageSpaces = document.querySelectorAll(".tr3.t_one td a[title='打开新窗口']");
var imageUrls = document.querySelectorAll(".tr3.t_one td h3 a");
var skipUrls = document.querySelectorAll(".tr3.t_one td img[title='置顶帖标志']");

function getFirstValidImg(imgs) {
    var firstValidImg;
    firstValidImg = imgs[0];
    for (var i = 3; i < imgs.length; i++) {
        //if((imgs[i].naturalWidth>100)&&(imgs[i].naturalHeight>100)) {
        if(imgs[i].naturalWidth>100) {
            firstValidImg = imgs[i];
            break;
        }
    }
    return firstValidImg;
}
function showImg (responseText, imageSpacesIndex) {
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
    var img = getFirstValidImg(result.querySelectorAll("#read_tpc.f14 img"));
    var tempImg = document.createElement('img');
	tempImg.src = img.src;
	tempImg.width = 200;
	tempImg.height = 200;
	imageSpaces[imageSpacesIndex].appendChild(tempImg);
}
function httpGet(theUrl, showImgIndex)
{
	xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        	showImg(xmlhttp.responseText, showImgIndex);
            //return xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();    
}

for (var i = skipUrls.length; i < imageUrls.length; i++) { 
//for (var i = skipUrls.length; i < skipUrls.length+2; i++) { 
	//httpGet("http://bbs.soul-plus.net/read.php?tid-100758.html", i);
	httpGet(imageUrls[i].href, i);
}