export function initShaders(gl, vSource, fSource) {
    const program = gl.createProgram();
    const vertexShader = loaderShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = loaderShader(gl, gl.FRAGMENT_SHADER, fSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.program = program;
    return true;
}

function loaderShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

export function loadImg(image) {
    return new Promise((resolve) => {
        if (typeof image === 'string') {
            let img = new Image();
            img.src = image;
            img.onload = () => {
                resolve(img);
            }
        } else {
            resolve(image);
        }
    })
}