export default function(str) {
  // eslint-disable-next-line max-len
  const regex = /^(?=.*\d)(?=.*\W)(?=.*[A-Z]).{8,64}$/;
  const regexNum = /^(?=.*\d).{1,}$/;
  const regexSpecial = /^(?=.*\W).{1,}$/;
  const regexCapital = /^(?=.*[A-Z]).{1,}$/;
  const regexLength = /^.{8,64}$/;

  let errorStatus = false;
  let errorMessage =
    'Atleast 8-64 characters, 1 number, 1 special character, 1 capital letter';

  if (regexLength.test(str)) {
    errorMessage = errorMessage.replace(' 8-64 characters,', '');
  }
  if (regexNum.test(str)) {
    errorMessage = errorMessage.replace(' 1 number,', '');
  }
  if (regexSpecial.test(str)) {
    errorMessage = errorMessage.replace(' 1 special character,', '');
  }
  if (regexCapital.test(str)) {
    errorMessage = errorMessage.replace(' 1 capital letter', '');
  }

  if (regex.test(str) === false) {
    errorStatus = true;
  }

  return {
    message: errorMessage,
    errorStatus: errorStatus,
  };
}
