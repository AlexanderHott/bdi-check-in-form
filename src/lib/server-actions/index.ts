import {
  getPerson,
  getRecentCheckin,
  postCheckIn,
  postNewPerson,
} from "./actions";

export const QUERIES = {
  getPerson,
  getRecentCheckin,
};

export const MUTATIONS = {
  postCheckIn,
  postNewPerson,
};
