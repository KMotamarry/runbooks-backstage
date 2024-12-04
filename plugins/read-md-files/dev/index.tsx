import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { readMdFilesPlugin, ReadMdFilesPage } from '../src/plugin';

createDevApp()
  .registerPlugin(readMdFilesPlugin)
  .addPage({
    element: <ReadMdFilesPage />,
    title: 'Root Page',
    path: '/read-md-files',
  })
  .render();
