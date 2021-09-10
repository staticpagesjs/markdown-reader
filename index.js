const fs = require('fs');
const path = require('path');
const glob = require('glob');
const frontmatter = require('front-matter');

module.exports = {
  default: ({ cwd, pattern = '**/*.md', incremental, fstat } = {}) => ({
    [Symbol.iterator]() {
      let ibMinDate;
      let ibFilesetId;
      const ibStartDate = new Date();
      const ibPath = typeof incremental === 'string' ? incremental : '.incremental';
      if (incremental) {
        const ibState = fs.existsSync(ibPath) ? JSON.parse(fs.readFileSync(ibPath, 'utf-8')) : {};
        ibFilesetId = path.join(cwd, pattern).replace(/\\/g, '/');
        ibMinDate = ibState && ibState[ibFilesetId] ? new Date(ibState[ibFilesetId]) : null;
      }

      const absCwd = path.resolve(process.cwd(), cwd);
      const files = glob.sync(pattern, { cwd: absCwd, absolute: true });
      return {
        next() {
          let file;
          let fstatInfo = null; // cache fstat data if later used by fstat
          do {
            file = files.pop();
            if (incremental && file) {
              fstatInfo = fs.fstatSync(fs.openSync(file, 'r'));
            }
          } while (incremental && file && ibMinDate > fstatInfo.mtime);

          if (!file) { // no more input
            if (incremental) {
              const ibState = fs.existsSync(ibPath) ? JSON.parse(fs.readFileSync(ibPath, 'utf-8')) : {};
              ibState[ibFilesetId] = ibStartDate;
              fs.writeFileSync(ibPath, JSON.stringify(ibState, null, 2));
            }
            return { done: true };
          }

          const relativePath = path.relative(absCwd, file);
          const extName = path.extname(file);

          const fm = frontmatter(fs.readFileSync(file, 'utf-8'));
          const data = {
            header: {
              cwd: absCwd,
              path: relativePath,
              dirname: path.dirname(relativePath),
              basename: path.basename(relativePath, extName),
              extname: extName,
              ...(fstat && (fstatInfo || fs.fstatSync(fs.openSync(file, 'r'))))
            },
            attr: fm.attributes,
            body: fm.body,
          };

          return { value: data };
        }
      };
    }
  })
};
