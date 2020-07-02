export default function (arr) {
  return arr.findIndex(checkUnixEpoch);
}

function checkUnixEpoch(element) {
  return element.timestamp === '01/70';
}
