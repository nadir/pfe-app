import { Note } from "./publishNotes";

export function mergeNotes(backendNotes: Note[], frontendNotes: Note[]) {
  const mergedNotes = [...backendNotes];
  const backendNotesMap = new Map(backendNotes.map((note) => [note.id, note]));

  frontendNotes.forEach((frontendNote) => {
    const backendNote = backendNotesMap.get(frontendNote.id);

    if (!backendNote) {
      mergedNotes.push(frontendNote);
    } else if (
      new Date(frontendNote.updated_at) > new Date(backendNote.updated_at)
    ) {
      mergedNotes[mergedNotes.indexOf(backendNote)] = frontendNote;
    }
  });

  return mergedNotes;
}
