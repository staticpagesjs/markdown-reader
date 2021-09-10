import fs from 'fs';

export declare interface Options {
  cwd?: string = '.';
  pattern?: string = '**/*.md';
  incremental?: boolean = false;
  fstat?: boolean = false;
}

export declare interface Data {
  header: {
    cwd: string;
    path: string;
    dirname: string;
    basename: string;
    extname: string;
  } & Partial<fs.Stats>;
  attr: { [key: string]: unknown };
  body: string;
}

declare const _default: (options: Options) => Iterable<Data>;
export default _default;
