class Neuronal{
  constructor(){
    this.input    = new Matrix([[3, 5], [5, 1], [10, 2]]);
    this.output   = new Matrix([[-0.75],[-0.82],[-0.93]]);
    this.weights  = [new Matrix(2,3), new Matrix(3, 2), new Matrix(2, 1)].map(function(a){ return a.setRandom(); });

    this.sigmaSteps   = [];
    this.weightSteps  = [];
    this.partialError = [];

    this.currentStep = 0;
  }
  /* "Squash" a function from 0 to 1 */
  sigmoid(x){ return 1/(1+Math.pow(Math.E, -x)); };
  dsigmoid(x){ var e = Math.pow(Math.E, -x); return e/Math.pow(1+e, 2); };

  /* Negative number are transformed to 0 and positive stay the same. */
  rectifier(x){ return Math.max(0, x); };

  /* Show Weights */
  showWeights(){
    for(let i = 0; i < this.weights.length; i++){
      console.log(this.weights[i].toString());
    }
  };

  /* */
  weightStep(){
    if(this.currentStep < this.weights.length){
      var sigmoidstep = this.currentStep < 1 ? this.input : this.sigmaSteps[this.currentStep - 1];
      var weightstep  = this.weightSteps[this.currentStep] = sigmoidstep.dot(this.weights[this.currentStep]);
      console.log("WeightStep " + this.currentStep + ": \n" +  weightstep.toString());
      this.sigmoidStep();
      this.currentStep++;
    }
  };

  sigmoidStep(){
    var sigma = this.sigmaSteps[this.currentStep] = this.weightSteps[this.currentStep].f(this.sigmoid);
    console.log("SigmoidStep " + this.currentStep + ": \n" + sigma.toString());
  };


  /* Now going backwards */
  errorStep(){
    var c = this.currentStep, partial = null;
    if(this.weightSteps[this.weightSteps.length - 1].equal(this.output)){
      var derivate = this.weightSteps[c - 1].f(this.dsigmoid);
      if(this.partialError.length < 1){
        partial = this.partialError[c - 1] = this.sigmaSteps[c - 1].add(this.output).multiply(derivate);
      }else{
        partial = this.partialError[c - 1] = this.partialError[c].dot(this.weights[c].transpose()).multiply(derivate);
      }
      this.currentStep--;
    }else{
      console.error("Maybe all steps haven't been done.");
      return;
    }
    var laststep  = c < 2 ? this.input : this.sigmaSteps[c - 2];
    console.log("Partial Error Weight_" + c + ":\n" + laststep.transpose().dot(partial));
  };
}
