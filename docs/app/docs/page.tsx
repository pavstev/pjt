import { source } from '@/lib/source';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';

export default async function Page() {
  const page = source.getPage([]);
  if (!page) {
    return <div>Not found</div>;
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX components={defaultMdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}