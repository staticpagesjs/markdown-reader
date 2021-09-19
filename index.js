"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const front_matter_1 = require("front-matter");
const incremental_1 = require("@static-pages/incremental");
exports.default = ({ cwd, pattern = '**/*.md', incremental, fstat } = {}) => ({
    [Symbol.iterator]() {
        const absCwd = path.resolve(process.cwd(), cwd);
        const files = glob.sync(pattern, { cwd: absCwd, absolute: true });
        const incrementalHelper = incremental ? new incremental_1.IncrementalHelper(path.join(cwd, pattern).replace(/\\/g, '/'), typeof incremental === 'string' ? incremental : '.incremental') : null;
        return {
            next() {
                var _a;
                let file;
                do {
                    file = files.pop();
                } while (file && !((_a = incrementalHelper === null || incrementalHelper === void 0 ? void 0 : incrementalHelper.isNew(file)) !== null && _a !== void 0 ? _a : true));
                if (!file) { // no more input
                    incrementalHelper === null || incrementalHelper === void 0 ? void 0 : incrementalHelper.finalize();
                    return { done: true };
                }
                const relativePath = path.relative(absCwd, file);
                const extName = path.extname(file);
                const fm = (0, front_matter_1.default)(fs.readFileSync(file, 'utf-8'));
                const data = {
                    header: Object.assign({ cwd: absCwd, path: relativePath, dirname: path.dirname(relativePath), basename: path.basename(relativePath, extName), extname: extName }, (fstat && ((incrementalHelper === null || incrementalHelper === void 0 ? void 0 : incrementalHelper.fstat) || fs.fstatSync(fs.openSync(file, 'r'))))),
                    attr: fm.attributes,
                    body: fm.body,
                };
                return { value: data };
            }
        };
    }
});
