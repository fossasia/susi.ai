export default function(str) {
  const regex = /^(.{5,51})$/;
  return regex.test(str);
}
