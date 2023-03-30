import fs from "fs";

export const getAllKeys = (obj: any, indent = 0) => {
  let keys = "";
  if (typeof obj !== "object") {
    return keys;
  }
  for (let key in obj) {
    keys += " ".repeat(indent) + key + "\n";
    if (typeof obj[key] === "object") {
      keys += getAllKeys(obj[key], indent + 2);
    }
  }
  return keys;
};

export const toHTMLfile = (response: any, filename: string) => {
  fs.writeFile(filename, response.data, function (err: any) {
    if (err) throw err;
    console.log("Response saved as example.html");
  });
};
