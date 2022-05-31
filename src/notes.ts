export interface Note {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: Array<string>;
  body: string;
}

export const notes: Array<Note> = [];
