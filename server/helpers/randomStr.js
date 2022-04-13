module.exports = () => {
  const init = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let i = 0;
  let str = '';

  while (i < 16) {
    str += init.charAt(Math.floor(Math.random() * init.length));
    i += 1;
  }

  return str;
};
