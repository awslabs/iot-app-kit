/* eslint-disable */
let error = console.error;

// Fail tests on console.error
console.error = function (message) {
  error.apply(console, arguments); // keep default behaviour
  throw (message instanceof Error ? message : new Error(message))
};
