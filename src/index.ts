import frontmatter from 'front-matter';
import reader, { FileReaderOptions, FileReaderData } from '@static-pages/file-reader';

export interface Options {
	cwd?: FileReaderOptions['cwd'];
	pattern?: FileReaderOptions['pattern'];
	incremental?: FileReaderOptions['incremental'];
	attrKey?: string;
	bodyKey?: string;
}

export type Data<AttrKey extends string = 'attr', BodyKey extends string = 'body'> = Pick<FileReaderData, 'header'> & (
	AttrKey extends ''
	? Record<string, unknown>
	: { [attr in AttrKey]: Record<string, unknown>; }
) & {
		[body in BodyKey]: string;
	};

export const markdownReader = ({ cwd = 'pages', pattern = '**/*.md', incremental = false, attrKey = '', bodyKey = 'body' }: Options = {}) => ({
	*[Symbol.iterator]() {
		for (const raw of reader({ cwd, pattern, incremental })) {
			const fmData = frontmatter<Record<string, unknown>>(raw.body);
			yield {
				header: raw.header,
				...(attrKey ? { [attrKey]: fmData.attributes } : fmData.attributes),
				[bodyKey]: fmData.body,
			};
		}
	}
});

export default markdownReader;
