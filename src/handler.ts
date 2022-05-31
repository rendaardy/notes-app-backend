import { randomUUID } from 'node:crypto';

import { notes } from './notes.js';

import type { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import type { Note } from './notes.js';

type RequestPayload = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

type ResponsePayload = {
  status: string;
  message: string;
  data: any;
};

export async function getAllNotesHandler(
  _request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> {
  return h.response({
    status: 'success',
    message: 'Retrieved all notes',
    data: {
      notes,
    },
  });
}

export async function getNoteHandler(
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> {
  const { id } = request.params;
  const note = notes.find((note) => note.id === id);
  let responsePayload: ResponsePayload;
  let statusCode: number;

  if (!note) {
    statusCode = 404;
    responsePayload = {
      status: 'error',
      message: 'Note not found',
      data: null,
    };
  } else {
    statusCode = 200;
    responsePayload = {
      status: 'success',
      message: 'Retrieved note',
      data: {
        note,
      },
    };
  }

  return h.response(responsePayload).code(statusCode).type('application/json');
}

export async function addNoteHandler(
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> {
  const { title, tags, body } = request.payload as RequestPayload;
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const notesLength = notes.length;
  const newLength = notes.push({ id, title, tags, body, createdAt, updatedAt });
  let resonsePayload: ResponsePayload;
  let statusCode: number;

  if (newLength !== notesLength + 1) {
    resonsePayload = {
      status: 'error',
      message: 'Failed to add note',
      data: null,
    };
    statusCode = 500;
  } else {
    resonsePayload = {
      status: 'success',
      message: 'Note added successfully',
      data: {
        noteId: id,
      },
    };
    statusCode = 201;
  }
  return h.response(resonsePayload).code(statusCode).type('application/json');
}

export async function editNoteHandler(
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> {
  const { id } = request.params;
  const note = notes.find((note) => note.id === id);
  let responsePayload: ResponsePayload;
  let statusCode: number;

  if (!note) {
    statusCode = 404;
    responsePayload = {
      status: 'error',
      message: 'Note not found',
      data: null,
    };
  } else {
    const { title, tags, body } = request.payload as RequestPayload;
    const updatedAt = new Date().toISOString();

    note.title = title;
    note.tags = tags;
    note.body = body;
    note.updatedAt = updatedAt;

    statusCode = 200;
    responsePayload = {
      status: 'success',
      message: 'Note updated successfully',
      data: {
        noteId: id,
      },
    };
  }

  return h.response(responsePayload).code(statusCode).type('application/json');
}

export async function deleteNoteHandler(
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> {
  const { id } = request.params;
  const note = notes.find((note) => note.id === id);
  let responsePayload: ResponsePayload;
  let statusCode: number;

  if (!note) {
    statusCode = 404;
    responsePayload = {
      status: 'error',
      message: 'Note not found',
      data: null,
    };
  } else {
    const index = notes.indexOf(note);
    const deletedNotes = notes.splice(index, 1);
    if (deletedNotes.length === 0) {
      statusCode = 500;
      responsePayload = {
        status: 'error',
        message: 'Failed to delete note',
        data: null,
      };
    } else {
      statusCode = 200;
      responsePayload = {
        status: 'success',
        message: 'Note deleted successfully',
        data: {
          noteId: id,
        },
      };
    }
  }

  return h.response(responsePayload).code(statusCode).type('application/json');
}
