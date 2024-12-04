import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const readMdFilesPlugin = createPlugin({
  id: 'read-md-files',
  routes: {
    root: rootRouteRef,
  },
});

export const ReadMdFilesPage = readMdFilesPlugin.provide(
  createRoutableExtension({
    name: 'Runbooks',
    component: () =>
      import('./components/GithubMarkdownDocsPage').then(m => m.GithubMarkdownDocsPage),
    mountPoint: rootRouteRef,
  }),
);
