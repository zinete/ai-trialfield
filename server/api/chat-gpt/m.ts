import { showError, useError } from "nuxt/app";

export default defineEventHandler(async (event) => {
  try {
    const db = hubDatabase();
    return db;
  } catch (error) {
    return error;
  }
});
