export default function ResultStatusIndicator(props) {
  const lowerCasedProps = {};
  for (const key in props) {
    // converted to lowercase because react expects custom attributes on a dom element to be lowercase
    lowerCasedProps[key.toLowerCase()] = props[key];
  }
  return (
    <div
      data-testid="result-status-indicator"
      className={lowerCasedProps.textcolor}
      {...lowerCasedProps}
    >
      <span>{lowerCasedProps.message}</span>
      <i data-testid="icon-indicator" className={`icon ${lowerCasedProps.indicatortype}`}></i>
    </div>
  ); 
}
