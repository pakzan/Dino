class RigidBody {
    constructor(props) {
        const { pos, spd, acc, prev_t } = props

        this.state = {
            pos,
            spd,
            acc,
            prev_t // movement
        }
    }

    updateMovement({ pos, spd, acc }) {
        Object.assign(this.state, { pos, spd, acc })
    }

    getMovement() {
        const { pos, spd, acc } = this.state
        return { pos, spd, acc } 
    }

    update(cur_t) {
        let { pos, spd, acc, prev_t } = this.state

        const delta = (cur_t - prev_t) / 1000
        prev_t = cur_t
 
        // update pos, spd, acc
        pos[0] += spd[0] * delta
        pos[1] += spd[1] * delta
        spd[0] += acc[0] * delta
        spd[1] += acc[1] * delta
        if (pos[1] <= 0) {
            pos[1] = 0
            spd[1] = 0
            acc[1] = 0
        }

        // update done
        this.state = { pos, spd, acc, prev_t }
    }

}
 
export default RigidBody;
