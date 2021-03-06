import { GetterTree } from 'vuex'
import { State } from './state'
import { Project, Category, Requirement, Comment } from '../types/api';
import { Activity } from '../types/activities-api';

export type Getters = {
  projectsList(state: State): (parameters: any) => Project[]; //TODO: any type, replace by types in actions.ts!?
  getProjectById(state: State): (id: number) => Project | undefined;
  categoriesList(state: State): (projectId: number, parameters: any) => Category[];
  getCategoryById(state: State): (id: number) => Category | undefined;
  requirementsList(state: State): (requirementId: number, parameters: any) => Requirement[];
  getRequirementById(state: State): (id: number) => Requirement | undefined;
  commentsList(state: State): (requirementId: number, parameters: any) => Comment[];
  activitiesList(state: State): (parameters: any) => Activity[];
}

const numericalSortFunction = (property, sortAscending) => (a, b) => {
  if (a[property] !== undefined && b[property] !== undefined) {
    const compare = (a[property] - b[property]) * (sortAscending ? 1 : -1);
    return compare;
  }
  return 0;
};

const lexicographicalSortFunction = (property, sortAscending) => (a, b) => {
  if (a[property] !== undefined && b[property] !== undefined) {
    const compare = ((a[property] < b[property]) ? -1 : ((a[property] > b[property]) ? 1 : 0)) * (sortAscending ? 1 : -1);
    return compare;
  }
  return 0;
};

export const getters: GetterTree<State, State> & Getters = {

  projectsList: (state) => (parameters) => {
    let projects: Project[] = Object.values(state.projects);

    const sortAscending = parameters.sort.charAt(0) === '+';
    const sortArgument = parameters.sort.substring(1);

    // first, sort alphabetically in all cases
    projects.sort((a, b) => {
      if (a['name'] && b['name']) {
        const compare = a['name'].localeCompare(b['name'], undefined, {numeric: true, sensitivity: 'base'});
        return compare;
      }
      return 0;
    });
    if ((sortArgument === 'name') && !sortAscending) {
      projects.reverse();
    }
    // then sort according to sort argument
    switch(sortArgument) {
      case 'last_activity':
        projects.sort(lexicographicalSortFunction('lastUpdatedDate', sortAscending));
        break;
      case 'date':
        projects.sort(lexicographicalSortFunction('creationDate', sortAscending));
        break;
      case 'requirement':
        projects.sort(numericalSortFunction('numberOfRequirements', sortAscending));
        break;
      case 'follower':
        projects.sort(numericalSortFunction('numberOfFollowers', sortAscending));
        break;
    }

    projects = projects.filter(project => project.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return projects;//.slice(0, parameters.per_page);
  },

  getProjectById: (state) => (id: number) => {
    return state.projects[id];
  },

  categoriesList: (state) => (projectId, parameters) => {
    let categories: Category[] = Object.values(state.categories).filter(category => (category.projectId === projectId));

    const sortAscending = parameters.sort.charAt(0) === '+';
    const sortArgument = parameters.sort.substring(1);
    // first, sort alphabetically in all cases
    categories.sort((a, b) => {
      if (a['name'] && b['name']) {
        const compare = a['name'].localeCompare(b['name'], undefined, {numeric: true, sensitivity: 'base'});
        return compare;
      }
      return 0;
    });
    if ((sortArgument === 'name') && !sortAscending) {
      categories.reverse();
    }
    // then sort according to sort argument
    switch(sortArgument) {
      case 'last_activity':
        categories.sort(lexicographicalSortFunction('lastUpdatedDate', sortAscending));
        break;
      case 'date':
        categories.sort(lexicographicalSortFunction('creationDate', sortAscending));
        break;
      case 'requirement':
        categories.sort(numericalSortFunction('numberOfRequirements', sortAscending));
        break;
      case 'follower':
        categories.sort(numericalSortFunction('numberOfFollowers', sortAscending));
        break;
    }

    categories = categories.filter(category => category.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return categories.slice(0, parameters.per_page);
  },

  getCategoryById: (state) => (id: number) => {
    return state.categories[id];
  },

  requirementsList: (state) => (categoryId, parameters) => {
    // filter all requirements who have a category object with id equaling the requested categoryId
    let requirements: Requirement[] = Object.values(state.requirements).filter(requirement => (requirement.categories.some(c => c.id === categoryId)));

    const sortAscending = parameters.sort.charAt(0) === '+';
    const sortArgument = parameters.sort.substring(1);
    // first, sort alphabetically in all cases
    requirements.sort((a, b) => {
      if (a['name'] && b['name']) {
        const compare = a['name'].localeCompare(b['name'], undefined, {numeric: true, sensitivity: 'base'});
        return compare;
      }
      return 0;
    });
    if ((sortArgument === 'name') && !sortAscending) {
      requirements.reverse();
    }
    // then sort according to sort argument
    switch(sortArgument) {
      case 'last_activity':
        requirements.sort(lexicographicalSortFunction('lastUpdatedDate', sortAscending));
        break;
      case 'date':
        requirements.sort(lexicographicalSortFunction('creationDate', sortAscending));
        break;
      case 'comment':
        requirements.sort(numericalSortFunction('numberOfComments', sortAscending));
        break;
      case 'follower':
        requirements.sort(numericalSortFunction('numberOfFollowers', sortAscending));
        break;
      case 'vote':
        requirements.sort(numericalSortFunction('upVotes', sortAscending));
        break;
    }

    requirements = requirements.filter(requirement => requirement.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return requirements.slice(0, parameters.per_page);
  },

  getRequirementById: (state) => (id: number) => {
    return state.requirements[id];
  },

  commentsList: (state) => (requirementId, parameters) => {
    let comments: Comment[] = Object.values(state.comments);

    return comments.slice(0, parameters.per_page);
  },

  activitiesList: (state) => (parameters) => {
    let activities: Activity[] = Object.values(state.activities);

    return activities.slice(0, parameters.limit);
  },

}
