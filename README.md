# Static Pages / Markdown reader
Front matter style markdown reader. Reads every file matching a given pattern. Produces an iterable.

## Usage
```js
import reader from '@static-pages/markdown-reader';

const iterable = reader({
  cwd: '.',
  pattern: '**/*.md',
  incremental: false,
  fstat: false,
});

// one item in the iterable:
// {
//   header: {
//     cwd: '/path/to/pages',
//     path: 'folder/file.md',
//     dirname: 'folder',
//     basename: 'file',
//     extname: '.md'
//   },
//   attr: {
//     frontMatterAttribute1: '...',
//     frontMatterAttribute2: '...',
//     ...
//   },
//   body: 'markdown content'
// }
```

`header` is extended with the `fs.fstat()` data if `options.fstat` is `true`.

### When `options.incremental` is `true`
- `fs.fstat()` is called on the files. If you need fstat data, its cheaper to set `options.fstat` to `true` instead of calling fstat again later by yourself.
- When iteration is done on the `iterable` a timestamp is saved to a `.incremental` file in the `process.cwd()`. This can be configured with `options.incremental`, see below.

## Docs

### __`reader(options: Options): Iterable<Data>`__

#### `Options`
- `options.cwd` (default: `process.cwd()`) sets the current working directory.
- `options.pattern` (default: `**/*.md`) a glob pattern that marks the files to read.
- `options.incremental` (default: `false`) return only those files that are newer than the datetime of the end of the last iteration of the files. Alternatively you can suppile a path describing where to store the incremental info. By default it creates a `.incremental` file in the `process.cwd()`.
- `option.fstat` (default: `false`) merge fstat data into `header`.

#### `Data`
- `data.header` contains metadata about the file.
  - `header.cwd` is the base directory wich contains the file.
  - `header.path` is the file path relative to the `header.cwd`.
  - `header.dirname` is equivalent to `path.dirname(header.path)`.
  - `header.basename` is equivalent to `path.basename(header.path, header.extname)`.
  - `header.extname` is equivalent to `path.extname(header.path)`.
  - `header` is extended with fstat data if `options.fstat` is `true`.
- `data.attr` contains attributes defined in the frontmatter style markdown.
- `data.body` is the markdown source text.

## Where to use this?
This module can be used to generate static HTML pages from *.md sources. Read more at the [Static Pages JS project page](https://staticpagesjs.github.io/).
