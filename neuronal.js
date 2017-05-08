class Neuronal{
  constructor(){
    this.inputs   = new Matrix([[0.1], [0.3], [0.9]]);
    this.outputs  = new Matrix([[0.1], [0.3], [0.9]]);
    this.weights  = [];
  }

  /* "Squash" a function from 0 to 1 */
  sigmoid(x){ return 1/(1+Math.pow(Math.E, -x)); };

  /* Negative number are transformed to 0 and positive stay the same. */
  rectifier(x){ return Math.max(0, x); };

  /* */
  nextStep(){

  };

}
