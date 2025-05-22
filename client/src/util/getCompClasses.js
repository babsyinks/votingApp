const getCompClasses = (defaulComptStyle, custClass) => {
  if (custClass.length === 0) return custClass;
  const additionalClasses = custClass.split(" ").reduce((acc, cls) => {
    if (acc === "") return defaulComptStyle[cls.trim()];
    return `${acc} ${defaulComptStyle[cls.trim()]}`;
  }, "");
  return additionalClasses;
};

export default getCompClasses; 
