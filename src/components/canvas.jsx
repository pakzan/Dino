import React, { Component } from 'react';
import spriteSrc from './images/sprite.png';

const sprite = new Image()
sprite.src = spriteSrc

class Canvas extends Component {
	clearCanvas() {
        const canvas = this.canvasRefs
		const ctx = canvas.getContext("2d")

		ctx.setTransform(1, 0, 0, 1, 0, 0)
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	setCanvas() {
		const { isNight, gameSize: [gW, gH], canvasSize: [cW, cH] } = this.props
		const gameScale = Math.min(cW, cH * 4) / gW

        const canvas = this.canvasRefs
		const ctx = canvas.getContext("2d")
		
		ctx.filter = `invert(${isNight})`
		if (isNight > 0.5) {
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, cW, cH)
		}
		ctx.scale(gameScale, gameScale)
	}

	drawCanvas(obj) {
		const { camera, gameSize: [gW, gH], canvasSize: [cW, cH] } = this.props
		const gameScale = Math.min(cW, cH * 4) / gW
		const padY = Math.max(0, 0.2 * (cH - gameScale * gH))
		const offX = camera.getMovement().pos[0]
		const { sprite: { x, y, w, h }, pos } = obj

		const canvas = this.canvasRefs
        const ctx = canvas.getContext("2d")
		const relPos = [
			pos[0] - offX, // camera offset
			padY + gH - pos[1] - h // convert left bottom to left top
		]
		
		ctx.drawImage(sprite, x, y, w, h, relPos[0], relPos[1], w, h)
	}

	drawCanvasAll() {
		const { isNight } = this.props
		const { infoImgs, landImgs, dinoImg, birdImgs, cactusImgs, cloudImgs, moonImg, starImgs } = this.props.imgs

		this.clearCanvas()
		this.setCanvas()
		
		if (isNight > 0.5) {
			this.drawCanvas(moonImg)
			starImgs.map(starImg => this.drawCanvas(starImg))
		}
		
		cloudImgs.map(cloudImg => this.drawCanvas(cloudImg))
		landImgs.map(landImg => this.drawCanvas(landImg))
		birdImgs.map(birdImg => this.drawCanvas(birdImg))
		cactusImgs.map(cactusImg => this.drawCanvas(cactusImg))
		this.drawCanvas(dinoImg)
		infoImgs.map(infoImg => this.drawCanvas(infoImg))
    }

	drawColliderAll() {
		const { camera, gameSize: [gW, gH], canvasSize: [cW, cH], objs: { dino, birds, cactuss } } = this.props
		const gameScale = Math.min(cW, cH * 4) / gW
		const padY = Math.max(0, 0.2 * (cH - gameScale * gH))
		const offX = camera.getMovement().pos[0]

		const canvas = this.canvasRefs
		const ctx = canvas.getContext("2d")
		
		let boxes = dino.getCollider()
		for (const colliders of birds.getColliders()) boxes.push(...colliders)
		for (const colliders of cactuss.getColliders()) boxes.push(...colliders)

		for (const [l, u, r, d] of boxes)
			ctx.strokeRect(l - offX, padY + gH - u, r - l, u - d)
    }

	componentDidMount() {
		sprite.onload = () => {
			this.drawCanvasAll()
		}
    }

    componentDidUpdate() {
        this.drawCanvasAll()
        // this.drawColliderAll()  //debug collider
    }
    
	render() { 
		const {canvasSize: [w, h]} = this.props
        return (
			<canvas
				width={w}
				height={h}
				ref={ref => this.canvasRefs = ref}
			/>
        );
    }
}
 
export default Canvas