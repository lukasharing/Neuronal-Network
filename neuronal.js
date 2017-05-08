class Neuronal{
  constructor(){
    this.input   = new Matrix([[3, 5], [5, 1], [10, 2]]);
    this.output  = null;

    this.weights = [new Matrix(3,2).setRandom()];
    this.currentStep = 0;
  }

  /* "Squash" a function from 0 to 1 */
  sigmoid(x){ return 1/(1+Math.pow(Math.E, -x)); };
  //dsigmoid(x){ var s = sigmoid(x); return s*(1-s); };

  /* Negative number are transformed to 0 and positive stay the same. */
  rectifier(x){ return Math.max(0, x); };

  /* Show Weights */
  showWeights(){
    for(let i = 0; i < this.weights.length; i++){
      console.log(this.weights[i].toString());
    }
  }

  /* */
  newStep(){
    if(this.weights.length < this.currentStep){
      var weightMatrix  = this.input.dot(this.weights[this.currentStep]);
      console.log(weightMatrix.toString());
      var sigmoidMatrix = weightMatrix.f(this.sigmoid);
      console.log(sigmoidMatrix.toString());
      this.output = sigmoidMatrix;
      this.currentStep++;
    }
  };
}
