const fs = require('fs');
const path = require('path');
const glob = require('glob');
const frontmatter = require('front-matter');

module.exports = {
  default: options => ({
    [Symbol.iterator]() {
      const cwd = path.resolve(process.cwd(), options.cwd);
      const files = glob.sync(options.pattern, { cwd: cwd, absolute: true });

      let ibMinDate;
      let ibFilesetId;
      const ibPath = typeof options.incremental === 'string' ? options.incremental : '.incremental';
      if (options.incremental) {
        const ibState = fs.existsSync(ibPath) ? JSON.parse(fs.readFileSync(ibPath, 'utf-8')) : {};
        ibFilesetId = path.join(options.cwd, options.pattern).replace(/\\/g, '/');
        ibMinDate = ibState && ibState[ibFilesetId] ? new Date(ibState[ibFilesetId]) : null;
      }

      return {
        next() {
          let file;
          do {
            file = files.pop();
          } while (options.incremental && file && ibMinDate > fs.fstatSync(fs.openSync(file, 'r')).mtime);

          if (!file) {
            if (options.incremental) {
              const ibState = fs.existsSync(ibPath) ? JSON.parse(fs.readFileSync(ibPath, 'utf-8')) : {};
              ibState[ibFilesetId] = new Date();
              fs.writeFileSync(ibPath, JSON.stringify(ibState, null, 2));
            }
            return { done: true };
          }

          const relativePath = path.relative(cwd, file);
          const extName = path.extname(file);

          const fm = frontmatter(fs.readFileSync(file, 'utf-8'));
          const data = {
            header: {
              cwd: cwd,
              path: relativePath,
              dirname: path.dirname(relativePath),
              basename: path.basename(relativePath, extName),
              extname: extName,
              ...(options.fstat && fs.fstatSync(fs.openSync(file, 'r')))
            },
            attributes: fm.attributes,
            body: fm.body,
          };

          return { value: data };
        }
      };
    }
  })
};
