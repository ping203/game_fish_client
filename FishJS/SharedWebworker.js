var ports = [];
var activePorts = [];

isUndefined = function (obj) {
    return typeof obj === 'undefined';
};

onconnect = function (e) {
    var port = e.ports[0];
    if (isUndefined(port)) return;
    ports.push(port);
    port.addEventListener("message", function (e) {
        console.log(e);
        if (e.data.type == 'start') {
            var idx = activePorts.indexOf(port);
            if (idx < 0) {
                activePorts.push(port);
            }
        } else if (e.data.type == 'pause') {
            var idx = activePorts.indexOf(port);
            if (idx >= 0) {
                activePorts.splice(idx, 1);
            }
        } else if (e.data.type == 'stop') {
            var activeIdx = activePorts.indexOf(port);
            if (activeIdx >= 0) {
                activePorts.splice(activeIdx, 1);
            }
            var portIdx = ports.indexOf(port);
            if (portIdx >= 0) {
                ports.splice(portIdx, 1);
            }
        }
    }, false);
    port.start();
};

addEventListener("connect", onconnect);

var interval = 1000 / 60;
function loop() {
    var len = activePorts.length;
    for (var i = 0; i < len; i++) {
        var port = activePorts[i];
        port.postMessage("");
    }
}

setInterval(loop, interval);


