const defaultOption = () => {
    return {
        type: 'POINTS',
        start: 0,
        size: 100,
        source: [],
        attributes: {},
        uniforms: {},
        mpas: {},
        byteSize: 4
    }
}
export default class {
    constructor(option) {
        this.option = Object.assign(defaultOption(), option);
        this.option.source = new Float32Array(this.option.source.flat());
        this.init();
    }
    async init() {
        this.updateAttribute();
        this.updateUniform();
        await this.updateMap();
        this.draw();
    }
    updateAttribute() {
        const { gl, attributes, source, byteSize } = this.option;
        let categorySize = 0;
        for (let key in attributes) {
            categorySize += attributes[key].size;
        }
        if (!categorySize || !source.length) {
            return;
        }
        const bufferData = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferData);
        gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW);
        for (let key in attributes) {
            let item = attributes[key];
            let attr = gl.getAttribLocation(gl.program, key);
            gl.vertexAttribPointer(attr, item.size, gl.FLOAT, false, categorySize * byteSize, item.index * byteSize);
            gl.enableVertexAttribArray(attr);
        }
    }
    updateUniform() {
        const { gl, uniforms } = this.option;
        for (let key in uniforms) {
            let item = uniforms[key];
            let uf = gl.getUniformLocation(gl.program, key);
            let { type, value } = item;
            value = value instanceof Array ? value : [value];
            gl[type](uf, ...value);
        }
    }
    async updateMap() {
        const { gl, maps } = this.option;
        const entries = Object.entries(maps || {});
        const imgs = entries.map((item) => {
            return this.loadImg(item[1].image).then((image) => {
                item[1].imageData = image;
            });
        })
        if (!imgs.length) {
            return;
        }
        await Promise.all(imgs);
        entries.forEach(([key, value], index) => {
            const { imageData, minFilter, magFilter, wrapS, wrapT } = value;
            const texture = gl.createTexture();
            const u_Sampler = gl.getUniformLocation(gl.program, key);
            gl.unform1i(u_Sampler, index);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl[`TEXTURE${index}`]);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGB,
                gl.RGB,
                gl.UNSIGNED_BYTE,
                imageData
            )
            if (minFilter) {
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MIN_FILTER,
                    minFilter
                )
            }
            if (magFilter) {
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MAG_FILTER,
                    magFilter
                )
            }
            if (wrapS) {
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_S,
                    wrapS
                )
            }
            if (wrapT) {
                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_T,
                    wrapT
                )
            }
        });
    }
    draw() {
        const { gl, type, start, size } = this.option;
        gl.drawArrays(gl[type], start, size);
    }
    loadImg(image) {
        return new Promise((resolve) => {
            if (typeof image === 'string') {
                image = new Image(image);
                image.onload = () => {
                    resolve(image);
                }
            } else {
                resolve(image);
            }
        })
    }
}