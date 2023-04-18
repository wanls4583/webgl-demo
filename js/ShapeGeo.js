export default class {
    constructor(geoData = []) {
        this.geoData = geoData.slice()
        this.triangles = []
        this.vertices = []
        this.findTriangle(0)
        this.updateVertices()
    }
    findTriangle(i) {
        if (this.geoData.length <= 3) {
            this.triangles.push([...this.geoData])
            return
        }
        const len = this.geoData.length
        const [i0, i1, i2] = [
            i % len,
            (i + 1) % len,
            (i + 2) % len
        ];
        const triangle = [
            this.geoData[i0],
            this.geoData[i1],
            this.geoData[i2],
        ]
        const a = this.sub(triangle[1], triangle[0])
        const b = this.sub(triangle[2], triangle[0])
        if (this.cross(a, b) > 0 && !this.includePoint(triangle)) {
            this.triangles.push(triangle)
            this.geoData.splice(i1, 1)
        }
        this.findTriangle(i1)
    }
    includePoint(triangle) {
        for (let i = 0; i < this.geoData.length; i++) {
            let p = this.geoData[i]
            if (!triangle.includes(p) && this.inTriangle(triangle, p)) {
                return true
            }
        }
        return false
    }
    inTriangle(triangle, p) {
        let [a, b, c] = triangle
        let ab = this.sub(b, a)
        let bc = this.sub(c, b)
        let ca = this.sub(a, c)
        let ap = this.sub(p, a)
        let bp = this.sub(p, b)
        let cp = this.sub(p, c)
        let dir = this.cross(ab, ap) >= 0
        if (dir === (this.cross(bc, bp) > 0) && dir === (this.cross(ca, cp) > 0)) {
            return true
        }
        return false
    }
    updateVertices() {
        for (let i = 0; i < this.triangles.length; i++) {
            let triangle = this.triangles[i]
            triangle.forEach(p => {
                this.vertices.push(p.x, p.y)
            })
        }
    }
    cross(a, b) {
        return a.x * b.y - a.y * b.x
    }
    sub(a, b) {
        return { x: b.x - a.x, y: b.y - a.y }
    }
}