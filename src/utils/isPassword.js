export default function(str) {
  // eslint-disable-next-line max-len
  let errorMessage =
    '8 characters required, 1 special character required, 1 number required, 1 capital letter required';

  const characterCountTest = /^[a-zA-Z0-9]{8,}$/;
  const specialCharacterTest = /[!@#$%^&*(),.?":{}|<>]/;
  const numberCheck = /\d+/;
  const capitalCheck = /[A-Z]+/;
  let errorStatus = true;

  if (characterCountTest.test(str)) {
    errorMessage = errorMessage.replace('8 characters required, ', '');
  }
  if (specialCharacterTest.test(str)) {
    errorMessage = errorMessage.replace('1 special character required, ', '');
  }
  if (numberCheck.test(str)) {
    errorMessage = errorMessage.replace('1 number required, ', '');
  }
  if (capitalCheck.test(str)) {
    errorMessage = errorMessage.replace('1 capital letter required', '');
  }

  const regex = /^(?=.*\d)(?=.*\W)(?=.*[A-Z]).{8,64}$/;
  if (regex.test(str)) {
    errorStatus = false;
  }

  return {
    message: errorMessage,
    errorStatus: errorStatus,
  };
}
