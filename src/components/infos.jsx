import { canvasInfo } from './config.js';

class Infos {
    constructor(props) {
        const { gameSize: [gameW, gameH], highScoreBlink: { score: scoreInterval, period: blinkPeriod, count: blinkCount } } = props

        this.cstate = { gameW, gameH, scoreInterval, blinkPeriod, blinkCount }
        this.state = {
            status: 'running',
            offX: 0,
            score: 0,
            highScore: localStorage.getItem('highScore') || 0,
            blinkStartTime: 0,
            blinkScore: 0
        }
    }

    getStatus() {
        return this.state.status
    }
    
    updateStatus(event) {
        let { status, blinkStartTime } = this.state
        switch (status) {
            case 'running':
                if (event === 'blinkStart') {
                    status = 'blinkStart'
                    blinkStartTime = new Date().getTime()
                }
                else if (event === 'gameOver') {
                    status = 'gameOver'
                    blinkStartTime = -1
                }
                break
            case 'blinkStart':
                if (event === 'running')
                    status = 'running'
                else if (event === 'gameOver') {
                    status = 'gameOver'
                    blinkStartTime = -1
                }
                break
            case 'gameOver':
                this.updateHighScore()
        }

        Object.assign(this.state, {status, blinkStartTime})
    }
    
    getTextImg(char, pos) {
        const { gameW, gameH } = this.cstate
        const { w: textW, h: textH } = canvasInfo.TEXT[0]

        let charPos
        if (char === 'H')
            charPos = 10
        else if (char === 'I')
            charPos = 11
        else
            charPos = parseInt(char)
        
        return {
            sprite: canvasInfo.TEXT[charPos],
            pos: [gameW - (14 - pos) * textW, gameH - textH - 10]
        }
    }

    updateHighScore() {
        localStorage.setItem('highScore', this.state.highScore)
    }

    getHighScore(score) {
        let { highScore } = this.state
        highScore = Math.max(score, highScore)
        this.state.highScore = highScore

        const strScore = String(highScore).padStart(5, '0')
        return [
            this.getTextImg(strScore[0], 3),
            this.getTextImg(strScore[1], 4),
            this.getTextImg(strScore[2], 5),
            this.getTextImg(strScore[3], 6),
            this.getTextImg(strScore[4], 7)
        ]
    }

    getCurScore(score) {
        const { blinkPeriod, blinkCount } = this.cstate
        const { blinkStartTime, blinkScore } = this.state
        const curTime = new Date().getTime()
        const curCount = (curTime - blinkStartTime) / blinkPeriod
        let strScore

        if (curCount < blinkCount) { //still blinking
            if (curCount % 1 < 0.5) //appear
                strScore = String(blinkScore).padStart(5, '0')
            else //disappear
                return []
        } 
        else
            strScore = String(score).padStart(5, '0')   
           
        return [
            this.getTextImg(strScore[0], 9),
            this.getTextImg(strScore[1], 10),
            this.getTextImg(strScore[2], 11),
            this.getTextImg(strScore[3], 12),
            this.getTextImg(strScore[4], 13)
        ] 
    }
    
    getGameState() {
        const { gameW, gameH } = this.cstate
        const { status } = this.state
        if (status === 'gameOver') {
            const { w: goW, h: goH } = canvasInfo.GAME_OVER
            const { w: rW, h: rH } = canvasInfo.RESTART
            const tH = (goH + rH) / 2
            return [
                {
                    sprite: canvasInfo.GAME_OVER,
                    pos: [gameW / 2 - goW / 2, gameH / 2 + tH - goH]
                },
                {
                    sprite: canvasInfo.RESTART,
                    pos: [gameW / 2 - rW / 2, gameH / 2 - tH + goH - rH]
                }
            ]
        }
        return []
    }

    getImgs() {
        const {offX, score} = this.state
        let imgs =
            [
                this.getTextImg('H', 0),
                this.getTextImg('I', 1),

                ...this.getHighScore(score),
                ...this.getCurScore(score),
                ...this.getGameState()
            ]
        // add offset
        for (let { pos } of imgs) {
            pos[0] += offX
        }
        return imgs
    }

    update(offX) {
        let { blinkScore } = this.state
        const { scoreInterval } = this.cstate
        const score = Math.round(offX / 50)
                
        if (score !== 0 && score % scoreInterval === 0) {
            this.updateStatus('blinkStart')
            blinkScore = score
        }
        else
            this.updateStatus('running')
        
        Object.assign(this.state, {offX, score, blinkScore})
        return this.getImgs()
    }
}
 
export default Infos