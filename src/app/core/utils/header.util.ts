export function customHeader(keyInput: string, valueInput: string): void {
  const client = new XMLHttpRequest();
  client.open('POST', '/log');
  client.setRequestHeader(keyInput, valueInput);

  window.location.href = 'http://localhost:4201';
}

export function initXMLHttpRequest(
  method: string,
  url: string,
  jwtoken: string
): void {
  let xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open(method, url, true);
  xmlHttpRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
  xmlHttpRequest.send();
}
