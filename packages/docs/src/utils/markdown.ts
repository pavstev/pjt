import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const markdownToHtml = async (markdown: string): Promise<string> => unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
    .then((file: { toString: () => string }) => file.toString())

export { markdownToHtml };