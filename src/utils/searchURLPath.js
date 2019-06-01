const searchURLPath = key => {
  if (window.location.href.indexOf(key) > -1) {
    return true;
  }
  return false;
};
export default searchURLPath;
