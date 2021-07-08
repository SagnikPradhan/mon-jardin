import path from "path";

export const MON_JARDIN_DIR_NAME = "mon-jardin";

export const root = (...parts: string[]) =>
  path.join(process.cwd(), MON_JARDIN_DIR_NAME, ...parts);
