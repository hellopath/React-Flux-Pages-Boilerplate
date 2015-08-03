class Vec2 {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
	distanceTo(v) {
		return Math.sqrt( this.distanceToSquared( v ) )
	}
	distanceToSquared(v) {
		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	}
}

export default Vec2
