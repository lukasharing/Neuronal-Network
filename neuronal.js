class Neuronal{
  constructor(inputs, outputs, weights){
    this.input    = inputs;
    this.output   = outputs;
    this.weights  = weights;

    this.sigmaSteps   = [];
    this.weightSteps  = [];
    this.sigmaError   = [];
    this.partialError = [];

    this.currentStep = 0;
  };


  /* "Squash" a function from 0 to 1 */
  sigmoid(x){ return 1/(1+Math.pow(Math.E, -x)); };
  dsigmoid(x){ let e = Math.pow(Math.E, -x); return e/Math.pow(1+e, 2); };
  gradient(x, f){ return (f(x + this.limit) - f(x - this.limit)) / (2*this.limit); };
  /* Negative number are transformed to 0 and positive stay the same. */
  rectifier(x){ return Math.max(0, x); };

  new(){
    this.sigmaSteps.length    = 0;
    this.weightSteps.length   = 0;
    this.sigmaError.length    = 0;
    this.partialError.length  = 0;
    this.currentStep          = 0;
  };

  /* Show Weights */
  showWeights(){
    for(let i = 0; i < this.weights.length; i++){
      console.log(this.weights[i].toString());
    }
  };

  /* */
  nextStep(){
    if(this.currentStep < this.weights.length){
      let weightStep  = this.weightStep();
      let sigmoidStep = this.sigmoidStep();
      this.currentStep++;
      return {weight: weightStep, sigmoid: sigmoidStep};
    }else{
      console.error("All Steps has been done.");
    }
  };

  weightStep(){
      let sigmoidstep = this.currentStep < 1 ? this.input : this.sigmaSteps[this.currentStep - 1];
      this.weightSteps[this.currentStep] = sigmoidstep.dot(this.weights[this.currentStep]);
      return this.weightSteps[this.currentStep];
  };

  sigmoidStep(){
    return this.sigmaSteps[this.currentStep] = this.weightSteps[this.currentStep].f(this.sigmoid);
  };


  /* Now going backwards */
  errorStep(k){
    let c = (this.currentStep || k) - 1, sigma = null;
    if(this.weightSteps[this.weightSteps.length - 1].equal(this.output)){
      let derivate = this.weightSteps[c].f(this.dsigmoid);
      if(this.sigmaError.length < 1){
        sigma = this.sigmaError[c] = this.sigmaSteps[c].add(this.output.scalar(-1)).multiply(derivate);
      }else{
        sigma = this.sigmaError[c] = this.sigmaError[c + 1].dot(this.weights[c + 1].transpose()).multiply(derivate);
      }
      this.currentStep--;
    }else{
      console.error("Maybe all steps haven't been done.");
      return;
    }
    let laststep  = c < 1 ? this.input : this.sigmaSteps[c - 1];
    let partial   = this.partialError[c] = laststep.transpose().dot(sigma);
    console.log(this.partialError);
    return partial;
  };

  error_cost(){
    return 0.5 * this.output.add(this.weightSteps[this.weightSteps.length - 1].scalar(-1)).pow(2).sum();
  };

  error_gradient(){
    let conct = new Matrix(1, 0);
    this.partialError.forEach(function(a){ conct = conct.concat(a.ravel()); });
    return conct;
  };

  numer_gradient(){
    let gradientError = [];
    let total_weights = 0;
    let epsilon       = 1e-4;
    this.weights.forEach(function(a){ total_weights += a.rows * a.colls; });

    let currentMatrix = 0;
    let copy_weights = this.weights.slice(0);
    let neuronal = new Neuronal(this.input.clone(), this.output.clone(), copy_weights);
    let error = new Matrix(1, total_weights);
    console.log("-------------------------------------* Calculating Errors.");
    for(let i = 0, m = 0; i < total_weights; i++){
      let current   = neuronal.weights[currentMatrix];
      let dimension = current.dimensions();
      let x = (i - m)%current.colls, y = Math.floor((i - m)/current.colls);
      current.set(x, y, current.get(x, y) + epsilon);
      neuronal.new();
      neuronal.nextStep();
      neuronal.nextStep();
      let cost1  = neuronal.error_cost();

      neuronal.new();
      current.set(x, y, current.get(x, y) - 2 * epsilon);
      neuronal.nextStep();
      neuronal.nextStep();
      let cost2  = neuronal.error_cost();
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
