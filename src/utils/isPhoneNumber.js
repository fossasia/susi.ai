export default function(phone = '') {
  if (!phone) {
    return false;
  }
  const re = /^(?:[0-9] ?){6,14}[0-9]$/;
  return re.test(phone);
}
