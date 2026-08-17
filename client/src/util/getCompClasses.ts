/**
 * Helps to get the concatenated classes that will be applied to the ui component that calls this
 * function. The classes are a combination of classes in the css file of the ui component and the
 * classes from other components that renders the ui component. E.g if Component A renders ui
 * component B,
 * classes from both components are concatenated by this utility function.
 *
 * @param defaulComptStyle Reference to imported style object having the ui component css classes.
 * @param classes Space separated classNames to apply to the component. ClassNames can be from css
 * classes in the ui component or the classNames added by a parent component rendering the ui
 * component.
 * @returns Concatenated className string
 */
const getCompClasses = (
  defaulComptStyle: Record<string, string> = {},
  classes: string = "",
): string => {
  if (!classes.trim()) return "";

  return classes
    .trim()
    .split(/\s+/)
    .map((cls) => defaulComptStyle?.[cls] || cls)
    .join(" ");
};

export default getCompClasses;
