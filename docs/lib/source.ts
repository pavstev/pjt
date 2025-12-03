import { docs } from '../source.config';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  // @ts-ignore
  source: docs.toFumadocsSource(),
});
