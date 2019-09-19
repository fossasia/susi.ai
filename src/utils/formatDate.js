const formatDate = timestamp => {
  timestamp = timestamp.split(' ').slice(1, 4);
  timestamp[1] = `${timestamp[1]},`;
  return timestamp.join(' ');
};

export default formatDate;
