export function areObjEquals(obj1: any, obj2: any): boolean {
  let equal = true;

  for (let [key, val] of Object.entries(obj1)) {
    if (obj2.hasOwnProperty(key)) {
      if (obj2[key] !== val) {
        equal = false;
      }
    } else {
      equal = false;
    }

    if (!equal) {
      break;
    }
  }

  return equal;
}
