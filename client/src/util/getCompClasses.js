/**
 * Helps to get the concatenated classes that will be applied to the ui component that calls this
 * function. The classes are a combination of classes in the css file of the ui component and the
 * classes from other components renders the ui component. E.g if Component A renders ui component B,
 * classes from both components are concatenated by this utility function.
 *
 * @param {Object} defaulComptStyle Reference to imported style object having the ui component css classes.
 * @param {String} classes Space separated classNames to apply to the component. ClassNames can be from css
 * classes in the ui component or the classNames added by a parent component rendering the ui component.
 * @returns {String}
 */
const getCompClasses = (defaulComptStyle, classes) => {
  if (classes.length === 0) return classes;
  const compClasses = classes.split(" ").reduce((acc, cls) => {
    /* defaulComptStyle[cls.trim()] represents styles from the css class that is integrated 
     into the current ui component e.g a class in Block.module.css file. If undefined is
     returned, just return the class itself, meaning it is a class from a component other
     than the ui component. */
    const currentClass = defaulComptStyle[cls.trim()] || cls;
    if (acc === "") return currentClass;
    return `${acc} ${currentClass}`;
  }, "");
  return compClasses;
};

export default getCompClasses;
