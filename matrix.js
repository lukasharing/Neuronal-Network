class Matrix{
	constructor(x, y){
		var ySize = 0, xSize = 0;
		if(x instanceof Array){
			xSize = x.length;
			ySize = x[0].length;
			this.values = new Array(xSize);
			for(var j = 0; j < xSize; j++){
				this.values[j] = new Array(ySize);
				for(var i = 0; i < ySize; i++){
					this.values[j][i] = x[j][i] || 0;
				}
			}
			this.xDimension = x.length;
			this.yDimension = x[0].length;
		}else{
			xSize = x;
			ySize = y;
			this.values = new Array(xSize);
			for(let i = 0; i < xSize; i++) this.values[i] = new Array(ySize);
		}
		this.xDimension = xSize;
		this.yDimension = ySize;
	};

	set(x, y, v){ this.values[y][x] = v; };
	get(x, y){ return this.values[y][x]; };
	isSquare(){ return this.xDimension == this.yDimension; };

	setIdentity(){
		if(this.isSquare()){
			for(let y = 0; y < this.yDimension; y++){
				for(let x = 0; x < this.xDimension; x++){
					this.set(x, y, (!(x^y))&1);
				}
			}
			return this;
		}else{
			console.log("The matrix has to be square.");
		}
	};

	setRandom(min, max, round){
		min = min || 0;
		max = max || 1;
		for(let y = 0; y < this.xDimension; y++){
			for(let x = 0; x < this.yDimension; x++){
				var random = Math.random() * (max - min) + min;
				this.set(x, y, round ? Math.round(random) : random);
			}
		}
		return this;
	};

	add(m){
		if(	this.xDimension == m.xDimension &&
				this.yDimension == m.yDimension ){
			var result = new Matrix(this.xDimension, this.yDimension);
			for (let y = 0; y < this.yDimension; y++){
				for (let x = 0; x < this.xDimension; x++){
					result.set(x, y, this.get(x, y) + m.get(x, y));
				}
			}
			return result;
		}else{
			console.error("Both matrices have to have the same dimensions.");
		}
	};

	multiply(m){
		if (this.xDimension == m.yDimension){
			let result = new Matrix(this.xDimension, m.yDimension);
			for (let y = 0; y < this.yDimension; y++){
				for (let x = 0; x < m.xDimension; x++){
					let total = 0;
					for (let k = 0; k < this.xDimension; k++){
						total += this.get(x, k) * m.get(k, y);
					}
					result.set(x, y, total);
				}
			}
			return result;
		}else{
			console.error("Both matrices have to have the same dimensions.");
		}
	};

	transpose(){
		var result = new Matrix(this.yDimension, this.xDimension);
		if(this.isSquare()){ // If it is a square matrix
			for(let y = 0; y < this.yDimension; y++){
				for(let x = y + 1; x < this.xDimension; x++){
					result.set(y, x, this.get(x, y));
					result.set(x, y, this.get(y, x));
				}
				result.set(y, y, this.get(y, y));
			}
		}else{
			for(let y = 0; y < this.yDimension; y++){
				for(let x = 0; x < this.xDimension; x++){
					result.set(y, x, this.get(x, y));
				}
			}
		}
		return result;
	};

	f(callback){
		var result = new Matrix(this.xDimension, this.yDimension);
		for (let y = 0; y < this.yDimension; y++){
			for (let x = 0; x < this.xDimension; x++){
				result.set(x, y, callback(this.get(x, y)));
			}
		}
		return result;
	};

	/* TODO: Determinant of the current matrix */
	determinant(){
		if(this.isSquare()){

		}else{
			console.error("The matrix has to be square.");
		}
	};

	toString(){
		let text = "";
		for (let y = 0; y < this.yDimension; y++){
			text += "| ";
			for (let x = 0; x < this.xDimension; x++){
				text += this.get(x, y).toString() + " | ";
			}
			text += "\n";
		}
		return text;
	};
}
