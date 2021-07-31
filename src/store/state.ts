import { Project, Category, Requirement, Comment, Dashboard } from '../types/bazaar-api';
import { Activity } from '../types/activities-api';

export interface LocalComment extends Comment {
  showReplyTo?: boolean;
  draftMessage?: String;
}

export type State = {
  projects: {[id: number]: Project};
  categories: {[id: number]: Category};
  requirements: {[id: number]: Requirement};
  comments: {[id: number]: LocalComment};
  activities: {[id: number]: Activity};
  dashboard: Dashboard;
}

export const state: State = {
  projects: {},
  categories: {},
  requirements: {},
  comments: {},
  activities: {},
  dashboard: {
    projects: [],
    categories: [],
    requirements: [],
  },
};
