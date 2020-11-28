import Obj from './obj'

class Moon extends Obj{
    constructor(props) {
        super(props)

        const { canvasW } = props
        this.cstate.canvasW = canvasW
    }

    update(cur_t, offX) {
        const img = super.update(cur_t)

        const { rigidBody, canvasW } = this.cstate
        const { pos, spd, acc } = rigidBody.getMovement()
        if (pos[0] < offX){
            pos[0] += canvasW
            rigidBody.updateMovement({ pos, spd, acc })
        }
        // console.log(pos[0], offX)
        return img
    }
}
 
export default Moon