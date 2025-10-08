/**
 * There are two files because we have to export the actions from a file. You should only import from "@/lib/server-actions"
 */
import {
  getPerson,
  getRecentCheckin,
  postCheckIn,
  postCheckOut,
  postNewPerson,
  sendEmail,
} from "./actions";

export const QUERIES = {
  getPerson,
  getRecentCheckin,
};

export const MUTATIONS = {
  postCheckIn,
  postNewPerson,
  postCheckOut,
  sendEmail,
};
