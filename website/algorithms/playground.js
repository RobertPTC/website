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

function mergeSortedArray(nums1, m, nums2, n) {
  if (!n) return;
  if (!m) {
    nums1[0] = nums2[0];
    return;
  }
  let pos = 0;
  let pointer1 = 0;
  let pointer2 = 0;
  while (pos < m + n) {
    const num1 = nums1[pointer1];
    const num2 = nums2[pointer2];
    if (pos > m) {
      num1[pos] = num2;
    }
    if (num2 < num1) {
      nums1[pointer1] = num2;
      pointer2 += 1;
    } else {
      pointer1 += 1;
    }
    pos += 1;
  }
  console.log("nums1 ", nums1);
}
mergeSortedArray([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3);
mergeSortedArray([1], 1, [], 0);
mergeSortedArray([0], 0, [1], 1);
