const formatDate = (args = new Date()) => {
  const date = new Date(args).toLocaleDateString('en-US');
  return date;
};

export default formatDate;
