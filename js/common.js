export function initShaders(gl, vSource, fSource, ifUse = true) {
    const program = gl.createProgram();
    const vertexShader = loaderShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = loaderShader(gl, gl.FRAGMENT_SHADER, fSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(ifUse) {
        gl.useProgram(program);
        gl.program = program;
    }
    return program;
}

export function createProgram(gl, vSource, fSource) {
    return initShaders(gl, vSource, fSource, false)
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

export function printMatrix(mt, title) {
    let elements = mt.elements
    let arr = []
    title && console.log(title)
    for(let i = 0; i < elements.length; i++) {
      let num = elements[i].toFixed(4)
      arr.push(num[0] == '-' ? num : ' ' + num)
      if(arr.length == 4) {
        console.log(arr.join('    '))
        arr = []
      }
    }
    console.log('---------------------------------------------------\n')
}