export const isProduction = () => {
  let domain = window.location.hostname;
  return domain.indexOf('.susi.ai') > 0;
};
