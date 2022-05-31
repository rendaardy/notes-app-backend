import {
  addNoteHandler,
  getAllNotesHandler,
  getNoteHandler,
  editNoteHandler,
  deleteNoteHandler,
} from './handler.js';

import type { ServerRoute } from '@hapi/hapi';

export const routes: Array<ServerRoute> = [
  {
    method: 'GET',
    path: '/notes',
    handler: getAllNotesHandler,
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: getNoteHandler,
  },
  {
    method: 'POST',
    path: '/notes',
    handler: addNoteHandler,
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: editNoteHandler,
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: deleteNoteHandler,
  },
];
