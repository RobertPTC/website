function* idGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const ids = idGenerator();

console.log(ids.next().value); // 0
console.log(ids.next().value); // 1
console.log(ids.next().value); // 2
console.log(ids.next().value); // 3
console.log(ids.next().value); // 4
const a = [0, 1, 3];
for (let v in a) {
  console.log("v ", a[v]);
}

let obj = {
  a: 1,
};
// works to increment
obj["a"]++;

const numberOfRequests = 10000;
const rateLimit = 600;
let pages = {};

function numberToArray() {}

const numberOfWholeRequestPages = Math.floor(numberOfRequests / rateLimit);
const requestsOnLastPage = numberOfRequests % rateLimit;
for (let i = 0; i < numberOfWholeRequestPages; i++) {
  pages[i] = (i + 1) * rateLimit;
}
if (requestsOnLastPage) {
  pages[numberOfWholeRequestPages] = requestsOnLastPage;
}

console.log("pages ", pages);

function makeRequest() {}
