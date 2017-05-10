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
	equal(m){ return this.rows == m.rows && this.colls == m.colls; };
	dimensions(){ return this.rows * this.colls; };

	clone(){
		var clon = new Matrix(this.rows, this.colls);
		for(let j = 0; j < this.rows; j++){
			for(let i = 0; i < this.colls; i++){
				clon.set(i, j, this.get(i, j));
			}
		}
		return clon;
	};

	setIdentity(){
		if(this.isSquare()){
			for(let y = 0; y < this.rows; y++){
				for(let x = 0; x < this.rows; x++){
					this.set(x, y, (!(x^y))&1);
				}
			}
			return this;
		}else{
			console.error("The matrix has to be square.");
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

	setZero(){
		for(let y = 0; y < this.rows; y++){
			for(let x = 0; x < this.colls; x++){
				this.set(x, y, 0);
			}
		}
		return this;
	};

	add(m){
		if(	this.equal(m) ){
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

	scalar(n){
		var scalated = new Matrix(this.rows, this.colls);
		for(let j = 0; j < this.rows; j++){
			for(let i = 0; i < this.colls; i++){
				scalated.set(i, j, this.values[j][i] * n);
			}
		}
		return scalated;
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

	multiply(m){
		if (this.equal(m)){
			let result = new Matrix(this.rows, this.colls);
			for (let y = 0; y < this.rows; y++){
				for (let x = 0; x < this.colls; x++){
					result.set(x, y, this.get(x, y) * m.get(x, y));
				}
			}
			return result;
		}else{
			console.error("Both matrices have to have the same dimensions.");
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

	ravel(){
		var raveled = new Matrix(1, this.dimensions());
		for(let j = 0; j < this.rows; j++){
			for(let i = 0; i < this.colls; i++){
				raveled.set(i + j * this.colls, 0, this.get(i, j));
			}
		}
		return raveled;
	};

	concat(m){
		if(this.rows == 1 && m.rows == 1){
			var concat = new Matrix(1, this.colls + m.colls);
			for(let i = 0; i < this.colls; i++){
				concat.set(i, 0, this.get(i, 0));
			}
			for(let i = 0; i < m.colls; i++){
				concat.set(this.colls + i, 0, m.get(i, 0));
			}
			return concat;
		}else{
			console.error("Both matrices have to be an 1D arrays, try to revel them!");
		}
	}

	norm(){
		var value = 0;
		for(let j = 0; j < this.rows; j++){
			for(let i = 0; i < this.colls; i++){
				value += Math.pow(this.get(i, j), 2);
			}
		}
		return Math.sqrt(value);
	};

	pow(a){
		var result = new Matrix(this.rows, this.colls);
		for (let y = 0; y < this.rows; y++){
			for (let x = 0; x < this.colls; x++){
				result.set(x, y, Math.pow(this.get(x, y), 2));
			}
		}
		return result;
	};

	sum(){
		var value = 0;
		for(let j = 0; j < this.rows; j++){
			for(let i = 0; i < this.colls; i++){
				value += this.get(i, j);
			}
		}
		return value;
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
