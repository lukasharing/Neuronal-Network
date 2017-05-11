class Neuronal{
  constructor(inputs, weights){
    this.input    = inputs;
    this.weights  = weights;

    this.sigmaSteps   = [];
    this.weightSteps  = [];
    this.sigmaError   = [];
    this.partialError = [];

    this.currentStep = 0;

    /* Training */
    this.max_iterations = 100;
    this.crr_iterations = 0;
    this.error_norm     = 1e-6;
    this.hessian_matrix = null;
  };


  /* "Squash" a function from 0 to 1 */
  sigmoid(x){ return 1/(1+Math.pow(Math.E, -x)); };
  dsigmoid(x){ let e = Math.pow(Math.E, -x); return e/Math.pow(1+e, 2); };
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
      return sigmoidStep;
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
  errorStep(output){
    let c = this.currentStep - 1, sigma = null;
    if(this.weightSteps[this.weightSteps.length - 1].equal(output)){
      let derivate = this.weightSteps[c].f(this.dsigmoid);
      if(this.sigmaError.length < 1){
        sigma = this.sigmaError[c] = this.sigmaSteps[c].add(output.scalar(-1)).multiply(derivate);
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
    return partial;
  };

  error_cost(expected){
    this.new();
    let final = null;
    for(let i = 0; i < this.weights.length; i++){
      final = this.nextStep();
    }

    return 0.5 * expected.add(final.scalar(-1)).pow(2).sum();
  };

  error_gradient(){
    let conct = new Matrix(1, 0);
    this.partialError.forEach(function(a){ conct = conct.concat(a.ravel()); });
    return conct;
  };

  numer_gradient(output){
    let gradientError = [];
    let total_weights = 0;
    let epsilon       = 1e-4;
    this.weights.forEach(function(a){ total_weights += a.rows * a.colls; });

    /* New subneuronal with small increment of the weights. */
    let currentMatrix = 0;
    let copy_weights = [];
    this.weights.forEach(function(a){ copy_weights.push(a.clone()); });
    let neuronal = new Neuronal(this.input.clone(), copy_weights);
    let error = new Matrix(1, total_weights);

    let expected = this.sigmaSteps[this.sigmaSteps.length - 1];

    for(let i = 0, m = 0; i < total_weights; i++){
      let current   = neuronal.weights[currentMatrix];
      let dimension = current.dimensions();
      let x = (i - m)%current.colls, y = Math.floor((i - m)/current.colls);

      /* calculating f(x + \epsilon) */
      current.set(x, y, current.get(x, y) + epsilon);
      let cost1  = neuronal.error_cost(output);

      /* calculating f(x - \epsilon) */
      current.set(x, y, current.get(x, y) - 2 * epsilon);
      let cost2  = neuronal.error_cost(output);

      /* Add to the error gradient matrix */
      error.set(i, 0, (cost1 - cost2) / ( 2 * epsilon ));
      current.set(x, y, this.weights[currentMatrix].get(x, y));

      if(i - m + 1 >= dimension){
        currentMatrix++;
        m += dimension;
      }
    }
    return error;
  };

  gradient_checking(output){
    let grad1 = this.error_gradient();
    /* console.log("Gradient Vector: \n" + grad1.toString()); */
    let grad2 = this.numer_gradient(output);
    /* console.log("Numerical Gradient Vector: \n" + grad2.toString()); */
    let difference = (grad2.add(grad1.scalar(-1))).norm() / (grad2.add(grad1)).norm();
    return (difference < 1e-7) ? true : difference;
  };

  getApproximateGradientFunction(x){
    let deltaX = 1e-10, deltaY = 0;

    let xNew = new Matrix(1, x.rows), dy = new Matrix(1, x.rows);
    for (let i = 0; i < x.rows; i++){
      for (let j = 0; j < x.rows; j++){
        let xx = x.get(j, 0);
        xNew.set(j, 0, (i == j) ? (xx + deltaX) : xx);
      }
      deltaY = error_cost(xNew) - error_cost(x);
      dy.set(i, 0, deltaY / deltaX);
    }
    return dy;
  };

  train(output){
    if(this.gradient_checking(output)){
      let found = false;
      var gradient = this.error_gradient();

      /* Initialize hessian matrix. */
      this.hessian_matrix = new Matrix(gradient.colls, gradient.colls).setIdentity();
      while(this.crr_iterations < this.max_iterations && !found){
        found = this.LBFGSstep(gradient);
        this.crr_iterations++;
      }
    }
  };

  LBFGSstep(gradient){
    let dimension = gradient.colls;

    let convergence = gradient.norm();
    if (isNaN(convergence)) {
      console.error("the norm of the gradient was unconverged");
      return;
    }

    if (convergence < this.error_norm) {
      return true;
    }

    /* 1. obtain a direction pk by solving: P[k] = - B[k] * ▽f(x[k]) */
    let direction = new Matrix(1, dimension).setZeros();
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        direction.set(i, 0, direction.get(i, 0) + -this.hessian_matrix.get(i, j) * gradient.get(j, 0));
      }
    }

    /* 2. lineSearch: min f(x + lamda * p) */
    var self = this;
    let stepsize = goldenSectionMinimize(function(lamda) {
      let xNext = new Matrix(1, dimension);
      for (let i = 0; i < dimension; i++) {
        xNext.set(i, 0, gradient.get(i, 0) + lamda * direction.get(i, 0));
      }
      return self.error_cost(xNext);
    }, { guess: 0 });

    if (isNaN(stepsize)) {
      throw "can\'t find approximate stepsize";
    }

    /* 3. update: x[k + 1] = x[k] + stepsize * p[k],  s[k] = stepsize * p[k] */
    // s = stepsize * p
    let heessian0 = new Matrix(1, dimension);
    for (let i = 0; i < dimension; i++) {
      heessian0.set(i, 0, stepsize * gradient.get(i, 0));
      this.x[i] += s[i];
    }

    /* 4. next gradient: ▽f(x[k + 1]), y[k] = g[k + 1] - g[k] */
    // y = df(x[k + 1]) - df(x[k])
    let hessian1 = this.getApproximateGradientFunction(this.x);
    let y = new Matrix(1, dimension);
    for (let i = 0; i < dimension; i++) {
      y.set(i, 0, hessian1.get(i, 0) - gradient.get(i, 0));
    }

    /* 5. approximate hessian matrix */
    // (T) => transposition
    // 5.1 let _scalarA = s(T) * y
    let scalar0 = 0;
    for (let i = 0; i < dimension; i++) {
      scalar0 += heessian0.get(i, 0) * y.get(i, 0);
    }

    /* 5.2 let _vectorB = B * y */
    let _vectorB = new Matrix(dimension, dimension).setZeros();
      for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
          _vectorB.set(i, j, _vectorB.get(i, j) + identity.get(i, j) * y[j]);
        }
    }

    /* 5.3 let _scalarC = (_scalarA + y(T) * _vectorB) / (_scalarA * _scalarA) */
    let scalar1 = 0;
    for (let i = 0; i < dimension; i++) {
      scalar1 += y.get(i, 0) * _vectorB.get(i, 0);
    }
    scalar1 = (scalar0 + scalar1) / (scalar0 * scalar0);

    for (let i = 0; i < dimension; i++) {
      let si = s.get(i,0); vbi = _vectorB.get(i, 0);
      for (let j = 0; j < dimension; j++) {
        let sj = s.get(j, 0), vbj = _vectorB.get(j, 0);
        identity.set(i, j, identity.get(i, j) + scalar1 * si * sj - (vbi * sj + si * vbj) / scalar0);
      }
    }
    return false;
  };
}
