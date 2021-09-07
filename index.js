const fs = require("fs");
const path = require("path");
const glob = require("glob");
const frontmatter = require("front-matter");

export default options => ({
    [Symbol.iterator]() {
        const cwd = path.resolve(process.cwd(), options.cwd);
        const files = glob.sync(options.pattern, { cwd: cwd, absolute: true });
        return {
            next() {
                const file = files.pop();
                if (!file) return { done: true };

                const relativePath = path.relative(cwd, file);
                const extName = path.extname(file);

                const fm = frontmatter(file);
                const data = {
                    header: {
                        cwd: cwd,
                        path: relativePath,
                        dirname: path.dirname(relativePath),
                        basename: path.basename(relativePath, extName),
                        extname: extName,
                        ...(options.fstat && fs.fstatSync(file))
                    },
                    attributes: fm.attributes,
                    body: fm.body,
                };

                return { value: data };
            }
        };
    }
});
