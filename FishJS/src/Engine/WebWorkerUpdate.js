var pause = true;
var interval = 1000/60.0;

addEventListener('message', function (evt) {
    if (evt.data[0] == "start") {
        pause = false;
    } else if (evt.data[0] == "pause") {
        pause = true;
    }
}, false);

function loop() {
    if (!pause) {
        postMessage("");
    }
}

setInterval(loop, interval);