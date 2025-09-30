interface MockResultStatusIndicatorProps {
  textColor: string;
  indicatorType: string;
  message: string;
}

type LowerCasedResultStatusIndicatorProps = {
  [K in keyof MockResultStatusIndicatorProps as Lowercase<K>]: MockResultStatusIndicatorProps[K];
};

export default function ResultStatusIndicator(
  props: MockResultStatusIndicatorProps,
) {
  const lowerCasedProps = {} as LowerCasedResultStatusIndicatorProps;
  for (const key in props) {
    // converted to lowercase because react expects custom attributes on a dom element to be lowercase
    const lowerKey = key.toLowerCase() as keyof LowerCasedResultStatusIndicatorProps;
    lowerCasedProps[lowerKey] = props[key as keyof MockResultStatusIndicatorProps];
  }
  return (
    <div
      data-testid="result-status-indicator"
      className={lowerCasedProps.textcolor}
      {...lowerCasedProps}
    >
      <span>{lowerCasedProps.message}</span>
      <i
        data-testid="icon-indicator"
        className={`icon ${lowerCasedProps.indicatortype}`}
      ></i>
    </div>
  );
}
