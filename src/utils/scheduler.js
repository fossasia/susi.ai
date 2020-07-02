export const plannedFunction = (fnc, delay) =>
  new Promise((resolve) =>
    setTimeout(function () {
      fnc();
      resolve();
    }, delay),
  );

export function TaskRunner() {
  this.limit = 10;
  this.queue = [];
  this.active = 0;
}

TaskRunner.prototype.next = function () {
  if (this.queue.length) {
    this.runTask(...this.queue.shift());
  }
};

TaskRunner.prototype.runTask = function (task, fnc, delay) {
  this.active++;
  task(fnc, delay).then(() => {
    this.active--;
    this.next();
  });
};

TaskRunner.prototype.push = function (task, fnc, delay) {
  if (this.active < this.limit) {
    this.runTask(task, fnc, delay);
  } else {
    this.queue.push([task, fnc, delay]);
  }
};
