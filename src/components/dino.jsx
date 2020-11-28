import Obj from './obj'

class Dino extends Obj{
    constructor(props) {
        super(props)

        const { status, jumpSpd, fallAcc, hardDropAcc } = props
        
        this.state = {
            status,
            ducking: false
        }
        Object.assign(this.cstate, { jumpSpd, fallAcc, hardDropAcc })
    }

    update(cur_t) {
        const img = super.update(cur_t)
        
        const { status } = this.state
        const { rigidBody } = this.cstate
        const { pos } = rigidBody.getMovement()
        if (pos[1] === 0 && status === 'jump')
            this.updateStatus('landed')

        return img
    }

    updateStatus(event) {
        let { status, ducking } = this.state
        const { jumpSpd, fallAcc, hardDropAcc, rigidBody, animation } = this.cstate
        let { pos, spd, acc } = rigidBody.getMovement()
        const prev_status = status

        // get current key down
        if (event === 'duck_s')
            ducking = true
        else if (event === 'duck_e')
            ducking = false
        
        // handle event
        switch (status) {
            case 'wait':
                if (event === 'run_s')
                    status = 'run'
                else if (event === 'duck_s')
                    status = 'duck'
                else if (event === 'jump_s') {
                    status = 'jump'
                    spd[1] = jumpSpd
                    acc[1] = fallAcc
                }
                break
            case 'run':
                if (event === 'duck_s')
                    status = 'duck'
                else if (event === 'jump_s') {
                    status = 'jump'
                    spd[1] = jumpSpd
                    acc[1] = fallAcc
                }
                else if (event === 'crash')
                    status = 'crash'
                break
            case 'duck':
                if (event === 'duck_e')
                    status = 'run'
                else if (event === 'crash')
                    status = 'crash'
                break
            case 'jump':
                if (event === 'duck_s')
                    acc[1] = hardDropAcc
                else if (event === 'duck_e')
                    acc[1] = fallAcc
                else if (event === 'landed') {
                    if (ducking)
                        status = 'duck'
                    else
                        status = 'run'
                }
                else if (event === 'crash')
                    status = 'crash'
                break
        }
        
        rigidBody.updateMovement({ pos, spd, acc })
        animation.updateStatus(status)

        // update done
        this.state = { status, ducking }
        return prev_status !== status
    }
}
 
export default Dino