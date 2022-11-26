export class Track {
    constructor(timelen) {
        this.timelen = timelen;
        this.keyMap = new Map();
    }
    addTrack(keyMap) {
        keyMap.forEach((item, key) => {
            this.keyMap.set(key, item);
        });
    }
    getValue(startTime, property) {
        var value = '';
        var gap = (Date.now() - startTime) % this.timelen;
        this.keyMap.forEach((arr, key) => {
            if (property === key) {
                value = arr[0][1];
                for (var i = 0; i < arr.length - 1; i++) {
                    var now = arr[i];
                    var next = arr[i + 1];
                    if (gap > now[0] && gap <= next[0]) {
                        var k = (gap - now[0]) / (next[0] - now[0]);
                        value = now[1] + k * (next[1] - now[1]);
                        break;
                    }
                }
            }
        });
        return value;
    }
}