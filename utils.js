const debounce = (callback, delay = 500) => {
  let timeout;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};
