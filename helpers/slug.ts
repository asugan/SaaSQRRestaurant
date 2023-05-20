export const stringToSlug = (str: string) => {
  var trMap: any = {
    çÇ: "c",
    ğĞ: "g",
    şŞ: "s",
    üÜ: "u",
    ıİ: "i",
    öÖ: "o",
  };
  for (var key in trMap) {
    str = str.replace(new RegExp("[" + key + "]", "g"), trMap[key]);
  }
  return str
    .replace(/[^-a-zA-Z0-9\s]+/gi, "") // remove non-alphanumeric chars
    .replace(/\s/gi, "-") // convert spaces to dashes
    .replace(/[-]+/gi, "-") // trim repeated dashes
    .toLowerCase();
};

//old

/* export const stringToSlug = (str: string) => {
  str = str.toLowerCase();
  str = str.replace(/[^a-zA-Z0-9]/g, "-");

  // Remove any leading or trailing hyphens
  str = str.replace(/^-+|-+$/g, "");

  return str;
}; */
