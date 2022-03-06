import frontmatter from 'front-matter';
import reader, { Options as ReaderOptions, Data as ReaderData } from '@static-pages/file-reader';

export interface Options {
	cwd?: ReaderOptions['cwd'];
	pattern?: ReaderOptions['pattern'];
	incremental?: ReaderOptions['incremental'];
	attrKey?: string;
	bodyKey?: string;
}

export type Data<AttrKey extends string = 'attr', BodyKey extends string = 'body'> = Pick<ReaderData, 'header'> & (
	AttrKey extends ''
	? Record<string, unknown>
	: { [attr in AttrKey]: Record<string, unknown>; }
) & {
		[body in BodyKey]: string;
	};

export default ({ cwd = 'pages', pattern = '**/*.yaml', incremental = false, attrKey = '', bodyKey = 'body' }: Options = {}) => ({
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
