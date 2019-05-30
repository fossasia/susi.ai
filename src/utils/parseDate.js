let parseDate = dtstr => {
  if (dtstr) {
    // replace anything but numbers by spaces
    dtstr = dtstr.replace(/\D/g, ' ');
    // trim any hanging white space
    dtstr = dtstr.replace(/\s+$/, '');
    // split on space
    let dtcomps = dtstr.split(' ');
    // not all ISO 8601 dates can convert, as is
    // unless month and date specified, invalid
    if (dtcomps.length < 3) {
      return 'Invalid date';
    }
    // if time not provided, set to zero
    if (dtcomps.length < 4) {
      dtcomps[3] = 0;
      dtcomps[4] = 0;
      dtcomps[5] = 0;
    }
    // modify month between 1 based ISO 8601 and zero based Date
    dtcomps[1]--;
    const convdt = new Date(
      Date.UTC(
        dtcomps[0],
        dtcomps[1],
        dtcomps[2],
        dtcomps[3],
        dtcomps[4],
        dtcomps[5],
      ),
    );
    return convdt.toUTCString();
  }
};

export default parseDate;
