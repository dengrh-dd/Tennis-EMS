/**
 * Fine-grained capability keys for UI gating. Backed by a static role map in phase 1.
 */
export type Permission =
  | 'courses.view'
  | 'courses.create'
  | 'courses.edit'
  | 'courses.delete'
  | 'groups.view'
  | 'groups.create'
  | 'groups.edit'
  | 'groups.delete'
  | 'matches.view'
  | 'matches.create'
  | 'matches.edit'
  | 'matches.delete'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
