import PropTypes from "prop-types";
import Block from "components/ui/Block";
import useWindowSize from "hooks/useWindowSize";

/**
 * This component wraps its children in 2 layers. The first layer is the background while the
 * second one is the content layer that the children will be rendered in.
 *
 * @param {Object} param Component props
 * @param {React.ReactNode} props.children - Child elements to render inside this component.
 * @returns {JSX.Element} The rendered MultiLayerWrapper component.
 */
function MultiLayerWrapper({ children }) {
  const { width } = useWindowSize();
  const pad = width < 800 ? "p-2r" : "";
  return (
    <Block
      type="flex-horz"
      className={`mnh-100vh ${pad}`}
    >
      <Block className="bg-white-transparent border-rounded-16 p-2r mxw-600 w-full ta-center bs-black fadeIn">
        {children}
      </Block>
    </Block>
  );
}

MultiLayerWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MultiLayerWrapper;
