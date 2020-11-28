import { canvasInfo } from './config.js'

class Animation {
    constructor(props) {
        const { type, statusInfo, status, prev_t } = props
        const frms = canvasInfo[type]

        this.cstate = { frms, statusInfo }
        this.state = {
            ind: 0,
            status,
            prev_t // sprite
        }
        
    }

    getStatus() {
        return this.state.status
    }

    updateStatus(status) {
        Object.assign(this.state, { status })
    }

    getFrame() {
        const { frms } = this.cstate
        const { ind, status } = this.state
        
        const {
            statusInfo: {
                [status]: [frm_inds, ]
            }
        } = this.cstate

        // {x, y, w, h}
        return frms[frm_inds[ind]] 
    }

    update(cur_t) {
        let { ind, prev_t } = this.state
        const { status } = this.state
        const {
            statusInfo: {
                [status]: [frm_inds, interval]
            }
        } = this.cstate

        const delta = (cur_t - prev_t) / 1000
        
        // update sprite
        if (delta >= interval) {
            ind += 1
            prev_t = cur_t
        }
        ind %= frm_inds.length

        // update done
        Object.assign(this.state, { ind, prev_t })
    }

}
 
export default Animation;
