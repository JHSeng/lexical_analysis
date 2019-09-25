/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const stateTransition1 = function(s, i, e) {
  this.startState = s;
  this.inputChar = i;
  this.endState = e;
  this.printStateTransition1 = printStateTransition1;
};
function printStateTransition1() {
  console.log(this.startState, this.inputChar, this.endState);
}
