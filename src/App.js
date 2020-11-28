import React, { Component } from 'react'
import Dino from './components/dino'
import Moon from './components/moon'
import Objs from './components/objs'
import Lands from './components/lands'
import Canvas from './components/canvas'
import Infos from './components/infos'
import RigidBody from './components/rigidBody'
import AudioEffect from './components/audio'
import { dayTime, gameSize, objInfo } from './components/config.js'

class App extends Component {
	init({ startPlay }) {		
		const { INFOS, CAMERA, DINO, BIRDS, CACTUSS, CLOUDS, STARS, MOON } = JSON.parse(JSON.stringify(objInfo))
		const lands = new Lands()
		const audio = new AudioEffect()
		const infos = new Infos(INFOS)
		const camera = new RigidBody(CAMERA)
		const dino = new Dino(DINO)
		const birds = new Objs(BIRDS)
		const cactuss = new Objs(CACTUSS)
		const clouds = new Objs(CLOUDS)
		const stars = new Objs(STARS)
		const moon = new Moon(MOON)
		
		if (startPlay)
			dino.updateStatus('run_s')
		
		const cstate = {
			infos, gameSize, audio, camera,
			objs: {
				birds, cactuss, lands, dino, clouds, stars, moon
			}
		}
		const state = { 
			canvasSize: [document.body.clientWidth, document.body.clientHeight],
			isPlaying: startPlay,
			objImgs: {
				infoImgs: [],
				landImgs: [],
				birdImgs: [],
				cactusImgs: [],
				cloudImgs: [],
				starImgs: [],
				moonImg: moon.getImg(),
				dinoImg: dino.getImg(),
			},
			cur_t: 0
		}
		
		this.cstate = cstate
		if (this.state)
			this.setState(state)
		return { cstate, state }
	}

    constructor(props) {
		super(props)
		const { state } = this.init({ startPlay: false })
		this.state = state
	}

	hasCollided() {
		const { objs: { dino, birds, cactuss } } = this.cstate

		const boxes1 = dino.getCollider()
		let boxes2 = []
		for (const colliders of birds.getColliders()) boxes2.push(...colliders)
		for (const colliders of cactuss.getColliders()) boxes2.push(...colliders)
		
		for (const box1 of boxes1) {
			const [l1, u1, r1, d1] = box1
			for (const box2 of boxes2) {
				const [l2, u2, r2, d2] = box2
				const x_intercepted = (l1 < l2 && r1 > l2) || (l2 < l1 && l1 < r2)
				const y_intercepted = (u1 > u2 && d1 < u2) || (u2 > u1 && u1 > d2)
				if (x_intercepted && y_intercepted)
					return true
			}
		}

		return false
	}

	handleClick = () => {
		const { isPlaying } = this.state
		// reset
		if (!isPlaying) {
			this.init({startPlay: true})
		}
	}
	
	handleKey = event => {
		const { isPlaying } = this.state
		const { audio, objs: { dino } } = this.cstate
		const { keyCode, type, repeat } = event

		if (type === 'keydown' && !repeat) { // key down
			// check game status
			if (!isPlaying) {
				// reset
				this.init({startPlay: true})
			}
			
			// handle input
			if (keyCode === 40)
				dino.updateStatus('duck_s')
			else if ([38, 32].includes(keyCode))
				dino.updateStatus('jump_s') && audio.playSound('jump')
		}
		else if (type === 'keydown' && repeat) { // key hold
			// handle input
			if (isPlaying) {
				if (keyCode === 40)
					dino.updateStatus('duck_s')
				else if ([38, 32].includes(keyCode))
					dino.updateStatus('jump_s') && audio.playSound('jump')
			}
		}
		else if (type === 'keyup') { // key up
			// handle input
			if (isPlaying) {
				if (keyCode === 40)
					dino.updateStatus('duck_e')
				else if ([38, 32].includes(keyCode))
					dino.updateStatus('jump_e')
			}
		}
	}

	handleResize = () => {
		this.setState({canvasSize: [document.body.clientWidth, document.body.clientHeight]})
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			const { infos, audio, camera, objs: { dino, birds, cactuss, lands, clouds, stars, moon } } = this.cstate
			let { cur_t, isPlaying } = this.state

			if (isPlaying && document.hasFocus()) {
				cur_t += 20
				
				// camera movement
				camera.update(cur_t)
				const posX = camera.getMovement().pos[0]
				
				// game status				
				if (this.hasCollided()) {
					audio.playSound('crash')
					dino.updateStatus('crash')
					infos.updateStatus('gameOver')
					isPlaying = false
				}
				const infoImgs = infos.update(posX)
				if (infos.getStatus() === 'blinkStart')
					audio.playSound('score')
				
				// objects movement
				const dinoImg = dino.update(cur_t)
				const moonImg = moon.update(cur_t, posX)
				const birdImgs = birds.update(cur_t, posX)
				const cactusImgs = cactuss.update(cur_t, posX)
				const cloudImgs = clouds.update(cur_t, posX)
				const starImgs = stars.update(cur_t, posX)
				const landImgs = lands.update(posX)

				// update
				this.setState(
					{
						cur_t,
						isPlaying,
						objImgs: { infoImgs, dinoImg, birdImgs, cactusImgs, landImgs, cloudImgs, starImgs, moonImg }
					}
				)
			}
		}, 20);

		document.addEventListener("keydown", this.handleKey, false)
		document.addEventListener("keyup", this.handleKey, false)
		document.addEventListener("click", this.handleClick, false)
		window.addEventListener("resize", this.handleResize, false)
    }

	componentWillUnmount() {
        clearInterval(this.interval)
		document.removeEventListener("keydown", this.handleKey, false)
		document.removeEventListener("keyup", this.handleKey, false)
		document.removeEventListener("click", this.handleClick, false)
		window.removeEventListener("resize", this.handleResize, false)
    }

	render() { 
		const { camera, objs, gameSize } = this.cstate
		const { cur_t, objImgs, canvasSize} = this.state

		let isNight = (cur_t / 1000) % dayTime // scale to [0, 20)
		isNight = Math.abs(isNight - dayTime / 2) // [0, 20) => [0, 10]
		isNight -= dayTime / 4 // [0, 10] => [-5, 5)
		isNight = 1 / (1 + Math.pow(Math.E, -10 * isNight)) // sigmoid to (0, 1)

		return (
			<Canvas
				gameSize={ gameSize }
				canvasSize={ canvasSize }
				camera={ camera } 
				imgs={ objImgs } 
				objs={ objs } 
				isNight={ isNight } 
			/>
        )
    }
}
 
export default App