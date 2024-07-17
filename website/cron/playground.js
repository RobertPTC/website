function wrapper() {
  const inner = () => {};
  return inner;
}

const inner = wrapper();

console.log("inner ", inner.name);
console.log("wraper() ", wrapper().name);

console.log("===", inner.name === wrapper().name);
