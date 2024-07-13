class Timer {
  constructor() {}
  start() {
    this.start = Date.now();
  }
  stop() {
    this.elapsedTimer = Date.now() - this.start;
  }
  printElapsedTime() {
    console.log("this.elapsedTime ", this.elapsedTimer);
  }
}

const timer = new Timer();

function wrapper(f) {
  console.log("wrapper");
  return () => {
    f();
  };
}

setTimeout(
  wrapper(() => {
    console.log("timeout");
    timer.stop();
    timer.printElapsedTime();
  }),
  1000
);
timer.start();
