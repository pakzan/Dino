import RigidBody from './rigidBody';
import Animation from './animation';

// statusInfo: [[frame inds], update interval(s)]
class Obj {
    constructor(props) {
        const { type, statusInfo, status, pos, spd, acc, prev_t, colliderInfo } = props
        
        this.cstate = {
            rigidBody: new RigidBody({ pos, spd, acc, prev_t }),
            animation: new Animation({ type, statusInfo, status, prev_t }),
            colliderInfo
        }
    }

    getCollider() {
        const { animation, colliderInfo } = this.cstate
        const { sprite: { h }, pos } = this.getImg()
        const type = animation.getStatus()
        
        // l, u, r, d
        if (colliderInfo) {
            // convert left top => left bottom
            return colliderInfo[type].map(box => [
                pos[0] + box[0],
                pos[1] + h - box[1],
                pos[0] + box[0] + box[2],
                pos[1] + h - box[1] - box[3]
            ])
        }
        return []
    }

    getImg() {
        const { rigidBody, animation } = this.cstate
        const { pos } = rigidBody.getMovement()
        const frame = animation.getFrame()

        return {
            sprite: frame,
            pos: pos
        }
    }

    update(cur_t) {
        const { rigidBody, animation } = this.cstate

        // update pos, spd, acc
        rigidBody.update(cur_t)
        // update sprite
        animation.update(cur_t)

        return this.getImg()
    }

}
 
export default Obj