module.exports = (length = 16) => {
  const init = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let i = 0;
  let str = '';

  while (i < length) {
    str += init.charAt(Math.floor(Math.random() * init.length));
    i += 1;
  }

  return str;
};
