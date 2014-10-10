postMessage('Hello from worker!');
// Example: cross-origin XMLHttpRequest using permissions from the manifest file.
var x = new XMLHttpRequest();
x.open('GET', 'http://www.cwb.gov.tw/V7/index.htm');
x.onload = function() {
    postMessage('Result\n' + x.responseText);
};
x.send();