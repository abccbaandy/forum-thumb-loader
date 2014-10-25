function getPost(url, postIndex) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            postMessage({
                "args": [xmlhttp.responseText, postIndex]
            })
        }
    }
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
}

onmessage = function(e) {
    var args = e.data.args;
    getPost(args[0], args[1]);
};