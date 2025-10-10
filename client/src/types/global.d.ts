declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.css";

declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.jpeg" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };
  const src: string;
  export default src;
}

declare var module: {
  hot?: {
    accept(path?: string, callback?: () => void): void;
  };
};
