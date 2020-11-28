import Obj from './obj'

function randInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive 
}

function randChoice(dic) {
    const keys = Object.keys(dic)
    return keys[randInt(0, keys.length - 1)]
}

class Objs {
    constructor(props) {
        this.cstate = props
        this.state = {
            objs: []
        }
    }

    getColliders() {
        const { objs } = this.state
        return objs.map(obj => obj.getCollider())
    }

    getImgs() {
        const { objs } = this.state
        return objs.map(obj => obj.getImg())
    }

    update(cur_t, offX) {
        const { type, status, statusInfo, colliderInfo, minGap, posRange, spdRange, accRange } = this.cstate
        let { objs } = this.state

        // update each obj
        // remove off screen objs
        objs = objs.filter(obj => {
            const { pos, sprite } = obj.update(cur_t)
            const { w } = sprite
            return (pos[0] + w > offX)
        })

        // add new obj
        let spawnable = true
        for (const obj of objs) {
            const { pos, sprite } = obj.getImg()
            const { w } = sprite
            if ((offX + posRange.minX) - (pos[0] + w) < minGap) {
                spawnable = false
                break
            }
        }
        if (spawnable)
            objs.push(
                new Obj({
                    type, 
                    colliderInfo,
                    statusInfo,
                    status: (status === 'random') ? randChoice(statusInfo): status,
                    pos: [offX + randInt(posRange.minX, posRange.maxX), randInt(posRange.minY, posRange.maxY)],
                    spd: [randInt(spdRange.minX, spdRange.maxX), randInt(spdRange.minY, spdRange.maxY)],
                    acc: [randInt(accRange.minX, accRange.maxX), randInt(accRange.minY, accRange.maxY)],
                    prev_t: cur_t
                })
            )
            
        // update done
        this.state = { objs }
        return this.getImgs()
    }

}
 
export default Objs