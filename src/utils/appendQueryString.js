const appendQueryString = (
  location,
  history,
  queryStringKey,
  queryStringValue,
) => {
  if (location.search === '') {
    history.push(`?${queryStringKey}=${queryStringValue}`);
  } else if (location.search.indexOf(queryStringKey) > -1) {
    let arr = location.search.split('&');
    let flag = false;
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(queryStringKey) > -1) {
        if (i === 0) {
          flag = true;
        }
      } else if (arr[i].indexOf(queryStringKey) === -1) {
        result.push(arr[i]);
      }
    }
    history.push(
      `${flag ? '?' : ''}${result.join(
        '&',
      )}&${queryStringKey}=${queryStringValue}`,
    );
  } else {
    history.push(`${location.search}&${queryStringKey}=${queryStringValue}`);
  }
  window.scrollTo(0, 0);
};

export default appendQueryString;
