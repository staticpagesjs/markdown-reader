import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import frontmatter from 'front-matter';
import { IncrementalHelper } from '@static-pages/incremental';

export interface Options {
  cwd?: string;
  pattern?: string;
  incremental?: boolean;
  fstat?: boolean;
  attrKey?: string;
  bodyKey?: string;
}

export type Data<AttrKey extends string = 'attr', BodyKey extends string = 'body'> = {
  header: {
    cwd: string;
    path: string;
    dirname: string;
    basename: string;
    extname: string;
  } & Partial<fs.Stats>;
} & (AttrKey extends '' ? {
  [attr in AttrKey]: Record<string, unknown>;
} : Record<string, unknown>) & {
  [body in BodyKey]: string;
};

export default ({ cwd, pattern = '**/*.md', incremental, fstat, attrKey = 'attr', bodyKey = 'body' }: Options = {}) => ({
  [Symbol.iterator]() {
    const absCwd = path.resolve(process.cwd(), cwd);
    const files = glob.sync(pattern, { cwd: absCwd, absolute: true });

    const incrementalHelper = incremental ? new IncrementalHelper(
      path.join(cwd, pattern).replace(/\\/g, '/'),
      typeof incremental === 'string' ? incremental : '.incremental'
    ) : null;

    return {
      next() {
        let file: string;
        do {
          file = files.pop();
        } while (file && !(incrementalHelper?.isNew(file) ?? true));

        if (!file) { // no more input
          incrementalHelper?.finalize();
          return { done: true };
        }

        const relativePath = path.relative(absCwd, file);
        const extName = path.extname(file);

        const fm = frontmatter<Record<string, unknown>>(fs.readFileSync(file, 'utf-8'));
        const data = {
          header: {
            cwd: absCwd,
            path: relativePath,
            dirname: path.dirname(relativePath),
            basename: path.basename(relativePath, extName),
            extname: extName,
            ...(fstat && (incrementalHelper?.fstat || fs.fstatSync(fs.openSync(file, 'r'))))
          },
          ...(attrKey ? { [attrKey]: fm.attributes } : fm.attributes),
          [bodyKey || 'body']: fm.body,
        } as Data<typeof attrKey, typeof bodyKey>;

        return { value: data };
      }
    };
  }
});
