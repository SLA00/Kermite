import { qxGlobal } from './qxGlobal';

function camelCaseToHyphenCase(str: string) {
  return str.replace(/[A-Z]/g, (s) => '-' + s.charAt(0).toLowerCase());
}
function styleObjectToString(obj: { [key: string]: any }) {
  return Object.keys(obj)
    .map((key) => {
      const value = obj[key];
      const key1 = camelCaseToHyphenCase(key);
      return `${key1}:${value};`;
    })
    .join(' ');
}

function extractClassNamesToArray(
  classNames: string[] | { [key: string]: boolean },
): string[] {
  if (!classNames) {
    return [];
  }
  if (Array.isArray(classNames)) {
    return classNames;
  }
  return Object.keys(classNames).filter((key) => classNames[key]);
}

export function qxInterposeProps(
  props: any,
  vtype: string | object | Function,
) {
  if (typeof vtype !== 'string') {
    return;
  }
  if (props) {
    for (const key in props) {
      if (key.startsWith('on')) {
        const originalProc = props[key];
        delete props[key];
        const key1 = key.toLowerCase();

        props[key1] = originalProc
          ? (...a: any) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              originalProc?.(...a);
              qxGlobal.rerender();
            }
          : undefined;
      }
    }
    if (props.css || props.class || props.className || props.classNames) {
      const classNamesArray = extractClassNamesToArray(props.classNames);
      const classes = [
        props.css,
        props.class,
        props.className,
        ...classNamesArray,
      ]
        .filter((a) => !!a)
        .join(' ');
      delete props.css;
      delete props.className;
      props.class = classes;
    }
    if (props.style && typeof props.style === 'object') {
      props.style = styleObjectToString(props.style);
    }
  }
}
