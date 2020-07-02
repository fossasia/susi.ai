export default function (arr) {
  return arr.sort((a, b) => {
    let [aYear, aMonth] = a.timeStamp.split('-');
    let [bYear, bMonth] = b.timeStamp.split('-');
    if (aYear > bYear) {
      return 1;
    } else if (aYear === bYear) {
      return aMonth > bMonth ? 1 : -1;
    }
    return -1;
  });
}
