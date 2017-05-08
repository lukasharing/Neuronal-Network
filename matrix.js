class Matrix{
	constructor(r, c){
		var rows = 0, colls = 0;
		if(r instanceof Array){
			rows = r.length;
			colls = r[0].length;
			this.values = new Array(rows);
			for(var j = 0; j < rows; j++){
				this.values[j] = new Array(colls);
				for(var i = 0; i < colls; i++){
					this.values[j][i] = r[j][i] || 0;
				}
			}
		}else{
			rows = r;
			colls = c;
			this.values = new Array(rows);
			for(let i = 0; i < rows; i++) this.values[i] = new Array(colls);
		}
		this.rows = rows;
		this.colls = colls;
	};

	set(x, y, v){ this.values[y][x] = v; };
	get(x, y){ return this.values[y][x]; };
	isSquare(){ return this.rows == this.colls; };

	setIdentity(){
		if(this.isSquare()){
			for(let y = 0; y < this.rows; y++){
				for(let x = 0; x < this.rows; x++){
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
		round = round || false;
		for(let y = 0; y < this.rows; y++){
			for(let x = 0; x < this.colls; x++){
				var random = Math.random() * (max - min) + min;
				this.set(x, y, round ? Math.round(random) : random);
			}
		}
		return this;
	};

	add(m){
		if(	this.rows == m.rows &&
				this.colls == m.colls ){
			var result = new Matrix(this.rows, this.colls);
			for (let y = 0; y < this.rows; y++){
				for (let x = 0; x < this.colls; x++){
					result.set(x, y, this.get(x, y) + m.get(x, y));
				}
			}
			return result;
		}else{
			console.error("Both matrices have to have the same dimensions.");
		}
	};

	dot(m){
		if (this.colls == m.rows){
			let result = new Matrix(this.rows, m.colls);
			for (let y = 0; y < this.rows; y++){
				for (let x = 0; x < m.colls; x++){
					let total = 0;
					for (let k = 0; k < this.colls; k++){
						total += this.get(k, y) * m.get(x, k);
					}
					result.set(x, y, total);
				}
			}
			return result;
		}else{
			console.error("The number of the lefside Matrix colls does'nt match to the number of rows from the rightside Matrix.");
		}
	};

	transpose(){
		var result = new Matrix(this.colls, this.rows);
		if(this.isSquare()){ // If it is a square matrix
			for(let y = 0; y < this.rows; y++){
				for(let x = y + 1; x < this.colls; x++){
					result.set(y, x, this.get(x, y));
					result.set(x, y, this.get(y, x));
				}
				result.set(y, y, this.get(y, y));
			}
		}else{
			for(let y = 0; y < this.rows; y++){
				for(let x = 0; x < this.colls; x++){
					result.set(y, x, this.get(x, y));
				}
			}
		}
		return result;
	};

	f(callback){
		var result = new Matrix(this.rows, this.colls);
		for (let y = 0; y < this.rows; y++){
			for (let x = 0; x < this.colls; x++){
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
		for (let y = 0; y < this.rows; y++){
			text += "| ";
			for (let x = 0; x < this.colls; x++){
				text += this.get(x, y).toString() + " | ";
			}
			text += "\n";
		}
		return text;
	};
}
