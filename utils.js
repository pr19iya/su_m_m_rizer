exports.checkIfObjectEmpty = (obj = {}) => {
  return Object.keys(obj).length === 0;
};

exports.getOpenAPIErrorMessage = (code) => {
  if (code === 401) {
    return "Inavalid or expired API key";
  } else if (code === 429) {
    return "Too many requests or your quota is over";
  } else if (code === 503) {
    return "We are recieving heavy traffic! Try again after some time";
  } else {
    return "Server Error! Please try again later";
  }
};
