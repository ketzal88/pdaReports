export function decodeToken(token: string): any {
  if (!token) {
    return;
  }
  const _decodeToken = (token: string): any => {
    try {
      return JSON.parse(atob(token));
    } catch {
      return;
    }
  };
  return token
    .split('.')
    .map(token => _decodeToken(token))
    .reduce((acc, curr) => {
      if (!!curr) {
        acc = { ...acc, ...curr };
      }
      return acc;
    }, Object.create(null));
}

export function tokenExpired(token: string): boolean {
  try {
    let expTimeStamp = decodeToken(token).exp;
    let actualTimeStamp = Date.now() / 1000;
    if (expTimeStamp + 1 > actualTimeStamp) {
      return false;
    }
  } catch (error) {}
  return true;
}
