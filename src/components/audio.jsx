import { audioInfo } from './config.js'

class AudioEffect {
    constructor() {
        
        const crash = new Audio(audioInfo.CRASH)
        crash.volume = 1

        const jump = new Audio(audioInfo.JUMP)
        jump.volume = 1

        const score = new Audio(audioInfo.HIGH_SCORE)
        score.volume = 0.4
                
        this.cstate = {
            audios: { crash, jump, score }
        }
    }
    playSound(type) {
        const {audios} = this.cstate
        audios[type].play()
    }
}
export default AudioEffect