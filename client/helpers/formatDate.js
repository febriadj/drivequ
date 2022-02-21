const formatDate = (args = new Date()) => {
  const date = new Date(args).toLocaleDateString([], {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return date;
};

export default formatDate;
