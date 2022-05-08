import {exposeInMainWorld} from './exposeInMainWorld';

import type {CSSBeautifyOptions, HTMLBeautifyOptions, JSBeautifyOptions} from 'js-beautify';
import {css, html, js} from 'js-beautify';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CleanCSS from 'clean-css';
import type {MinifyOptions as TerserMinifyOptions} from 'terser';
import {minify as terserMinify} from 'terser';
import type {Options as TerserHtmlMinifyOptions} from 'html-minifier-terser';
import {minify as terserHtmlMinifier} from 'html-minifier-terser';

function beautifyHTML(input: string, options?: HTMLBeautifyOptions): FormatResult {
  return {
    code: html(input, options),
  };
}

function beautifyJS(input: string, options?: JSBeautifyOptions): FormatResult {
  return {
    code: js(input, options),
  };
}

function beautifyCSS(input: string, options?: CSSBeautifyOptions): FormatResult {
  return {
    code: css(input, options),
  };
}

async function minifyHTML(input: string, options?: TerserHtmlMinifyOptions): Promise<FormatResult> {
  return {
    code: await terserHtmlMinifier(input, options),
  };
}

async function minifyJS(input: string, options?: TerserMinifyOptions): Promise<FormatResult | undefined> {
  return {
    code: (await terserMinify(input, options)).code,
  };
}

function minifyCSS(input: string): FormatResult {
  const result = new CleanCSS({returnPromise: false, inline: false}).minify(input);
  if (result.errors.length > 0) {
    throw new Error(result.errors.join('\n'));
  }
  return {
    code: result.styles,
    warnings: result.warnings,
  };
}

// Export for types in contracts.d.ts
export const nodeFormatter = {beautifyHTML, beautifyJS, beautifyCSS, minifyHTML, minifyJS, minifyCSS} as const;

exposeInMainWorld('nodeFormatter', nodeFormatter);
