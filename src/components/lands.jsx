import { canvasInfo } from './config.js';

class Lands {
    
    constructor() {
        this.state = {
            offX: 0
        }
    }
    getImgs() {
		let { offX } = this.state
		const { w } = canvasInfo.LAND
        offX -= offX % w
        
        return [
            {
                sprite: canvasInfo.LAND,
                pos: [offX, 0]
            },
            {
                sprite: canvasInfo.LAND,
                pos: [offX + w, 0]
            }
        ]
    }

    update(offX) {
        this.state.offX = offX
        return this.getImgs()        
    }
}
 
export default Lands;