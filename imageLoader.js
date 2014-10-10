function httpGet(url, showImgIndex)
{
	xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
        	//getImg(xmlhttp.responseText, showImgIndex);
            postMessage({"args":[xmlhttp.responseText, showImgIndex]})
        }
    }
    xmlhttp.open("GET", url, false );
    xmlhttp.send();    
}

onmessage = function(e) {
    var args = e.data.args;
    httpGet(args[0], args[1]);
};