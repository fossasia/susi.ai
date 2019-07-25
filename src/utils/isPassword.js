export default function(str) {
  // eslint-disable-next-line max-len
  const regex = /^(?=.*\d)(?=.*\W)(?=.*[a-z]).{8,64}$/;
  return regex.test(str);
}
