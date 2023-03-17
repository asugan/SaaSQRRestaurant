export const stringToSlug = (str: string) => {
  str = str.toLowerCase();
  str = str.replace(/[^a-zA-Z0-9]/g, "-");

  // Remove any leading or trailing hyphens
  str = str.replace(/^-+|-+$/g, "");

  return str;
};
