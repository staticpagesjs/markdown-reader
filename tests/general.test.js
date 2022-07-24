import reader from '../esm/index.js';

test('it can use @static-pages/file-reader', async () => {
	const expected = ['file1', 'file2', 'file3'];

	const output = [...reader({
		cwd: 'tests/input',
		pattern: '**/file*.md',
	})].map(x => x.a);

	output.sort((a, b) => a.localeCompare(b));
	expect(output).toStrictEqual(expected);
});

test('attrKey can be customized', async () => {
	const expected = ['file1', 'file2', 'file3'];

	const output = [...reader({
		cwd: 'tests/input',
		pattern: '**/file*.md',
		attrKey: 'attr'
	})].map(x => x.attr.a);

	output.sort((a, b) => a.localeCompare(b));
	expect(output).toStrictEqual(expected);
});

test('bodyKey can be customized', async () => {
	const expected = ['file1 body', 'file2 body', 'file3 body'];

	const output = [...reader({
		cwd: 'tests/input',
		pattern: '**/file*.md',
		bodyKey: 'b',
	})].map(x => x.b.trim());

	output.sort((a, b) => a.localeCompare(b));
	expect(output).toStrictEqual(expected);
});
