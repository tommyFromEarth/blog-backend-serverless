 
 export const API = process.env.API
 
export const isNullOrWhitespace = function (input: string): boolean {
  if (typeof input === 'undefined' || input === null) {
    return true;
  }
  return input.replace(/\s/g, '').length < 1;
};
