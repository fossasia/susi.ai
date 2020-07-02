export default function (arr) {
  let mergedArr = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].timeStamp === arr[i + 1].timeStamp) {
      mergedArr.push({
        timeStamp: arr[i].timeStamp,
        count: arr[i].count + arr[i + 1].count,
      });
      i++;
    } else {
      mergedArr.push(arr[i]);
    }
  }
  return mergedArr;
}
