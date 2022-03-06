# Static Pages / Markdown reader
Front matter style file reader. Reads every file matching a given pattern. Produces an iterable.

## Usage
```js
import reader from '@static-pages/markdown-reader';

const iterable = reader({
  cwd: '.',
  pattern: '**/*.md',
  incremental: false,
  attrKey: 'attr',
  bodyKey: 'body',
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

## Docs

### __`reader(options: Options): Iterable<Data>`__

#### `Options`
- `options.cwd` (default: `process.cwd()`) sets the current working directory.
- `options.pattern` (default: `**/*.md`) a glob pattern that marks the files to read.
- `options.attrKey` (default: (empty)) contents of the yaml segment will be put under this key in the returned data object to prevent polluting the root level (eg. prevent the overwrite of the header or body field). When left empty the contents are put to the root level.
- `options.attrKey` (default: (empty)) file contents will be put under this key in the returned data object to prevent polluting the root (eg. prevent the overwrite of the header field). When left empty the contents are spread into the root object.
- `options.bodyKey` (default: `body`) markdown body text will be presented under this key. This allow you to give a better matching key for the markdown body if it helps your workflow.
- `options.incremental` (default: `false`) enables the incremental build. See more at [@static-pages/file-reader docs page](https://www.npmjs.com/package/@static-pages/file-reader#Incremental-builds).

#### `Data`
- `data.header` contains metadata about the file.
  - `header.cwd` is the base directory wich contains the file.
  - `header.path` is the file path relative to the `header.cwd`.
  - `header.dirname` is equivalent to `path.dirname(header.path)`.
  - `header.basename` is equivalent to `path.basename(header.path, header.extname)`.
  - `header.extname` is equivalent to `path.extname(header.path)`.
  - `header` is extended with fstat data if `options.fstat` is `true`.
- `data.attr` contains attributes defined in the frontmatter style markdown. Customizable with `options.attrKey`.
- `data.body` is the markdown source text. Customizable with `options.bodyKey`.

## Where to use this?
This module can be used to generate static HTML pages from *.md sources. Read more at the [Static Pages JS project page](https://staticpagesjs.github.io/).
