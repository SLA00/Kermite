import { compile } from './core/compile';
import { getSheet } from './core/get-sheet';
import { hash } from './core/hash';

/**
 * css entry
 * @param {String|Object|Function} val
 */
function css(val) {
  const ctx = this || {};
  const _val = val.call ? val(ctx.p) : val;

  return hash(
    _val.unshift
      ? _val.raw
        ? // Tagged templates
          // eslint-disable-next-line prefer-rest-params
          compile(_val, [].slice.call(arguments, 1), ctx.p)
        : // Regular arrays
          _val.reduce(
            (o, i) => (i ? Object.assign(o, i.call ? i(ctx.p) : i) : o),
            {},
          )
      : _val,
    getSheet(ctx.target),
    ctx.g,
    ctx.o,
    ctx.k,
  );
}

/**
 * CSS Global function to declare global styles
 * @type {Function}
 */
const glob = css.bind({ g: 1 });

/**
 * `keyframes` function for defining animations
 * @type {Function}
 */
const keyframes = css.bind({ k: 1 });

export { css, glob, keyframes };
