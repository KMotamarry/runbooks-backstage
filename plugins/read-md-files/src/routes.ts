import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'read-md-files',
  params: ['repoUrl'],
});
