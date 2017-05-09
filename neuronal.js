class Neuronal{
  constructor(inputs, outputs, weights){
    this.input    = inputs;
    this.output   = outputs;
    this.weights  = weights;

    this.sigmaSteps   = [];
    this.weightSteps  = [];
    this.partialError = [];

    this.currentStep = 0;
  };


  /* "Squash" a function from 0 to 1 */
  sigmoid(x){ return 1/(1+Math.pow(Math.E, -x)); };
  dsigmoid(x){ var e = Math.pow(Math.E, -x); return e/Math.pow(1+e, 2); };
  gradient(x, f){ return (f(x + this.limit) - f(x - this.limit)) / (2*this.limit); };
  /* Negative number are transformed to 0 and positive stay the same. */
  rectifier(x){ return Math.max(0, x); };

  new(){
    this.sigmaSteps.length = 0;
    this.weightSteps.length = 0;
    this.partialError.length = 0;
    this.currentStep = 0;
  };

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
      var sigmoid = this.sigmoidStep();
      this.currentStep++;
      return {sigmoid: sigmoid, weight: weightstep};
    }else{
      console.error("All Steps has been done.");
    }
  };

  sigmoidStep(){
    return this.sigmaSteps[this.currentStep] = this.weightSteps[this.currentStep].f(this.sigmoid);
  };


  /* Now going backwards */
  errorStep(k){
    let c = this.currentStep || k, partial = null;
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
    var laststep    = c < 2 ? this.input : this.sigmaSteps[c - 2];
    var errorMatrix = laststep.transpose().dot(partial);
    return errorMatrix;
  };

  error_cost(){
    return 0.5 * this.output.add(this.sigmaSteps[this.sigmaSteps.length - 1].scalar(-1)).pow(2).sum();
  };

  error_gradient(){
    var conct = new Matrix(1, 0);
    console.log(this.partialError);
    this.partialError.forEach(function(a){ conct.concat(a.ravel()); });
    console.log(conct);
    return conct;
  };

  numer_gradient(){
    let gradientError = [];
    let total_weights = 0;
    let epsilon       = 1e-4;
    this.weights.forEach(function(a){ total_weights += a.rows * a.colls; });

    let currentMatrix = 0;
    var copy_weights = this.weights.slice(0);
    var neuronal = new Neuronal(this.input.clone(), this.output.clone(), copy_weights);
    var error = new Matrix(1, total_weights);
    console.log("-------------------------------------* Calculating Errors.");
    for(let i = 0, m = 0; i < total_weights; i++){
      var current   = neuronal.weights[currentMatrix];
      var dimension = current.dimensions();
      var x = (i - m)%current.colls, y = Math.floor((i - m)/current.colls);
      current.set(x, y, current.get(x, y) + epsilon);
      neuronal.new();
      neuronal.weightStep();
      neuronal.weightStep();
      var cost1  = neuronal.error_cost();

      neuronal.new();
      current.set(x, y, current.get(x, y) - 2 * epsilon);
      neuronal.weightStep();
      neuronal.weightStep();
      var cost2  = neuronal.error_cost();
      error.set(i, 0, (cost1 - cost2) / ( 2 * epsilon ));

      current.set(x, y, current.get(x, y) + 2 * epsilon);
      if(i - m + 1 >= dimension){
        currentMatrix++;
        m += dimension;
      }
    }
    return error;
  };
}
