import frontmatter from 'front-matter';
import { fileReader, FileReaderOptions, FileReaderData } from '@static-pages/file-reader';

export type MarkdownReaderOptions = {
	attrKey?: string;
	bodyKey?: string;
} & FileReaderOptions;

export type MarkdownReaderData<AttrKey extends string = '', BodyKey extends string = 'body'> = Pick<FileReaderData, 'header'> & (
	AttrKey extends ''
	? Record<string, unknown>
	: { [attr in AttrKey]: Record<string, unknown>; }
) & {
		[body in BodyKey]: string;
	};

export const markdownReader = ({ attrKey = '', bodyKey = 'body', cwd = 'pages', pattern = '**/*.md', ...rest }: MarkdownReaderOptions = {}) => ({
	*[Symbol.iterator]() {
		for (const raw of fileReader({ cwd, pattern, ...rest })) {
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
