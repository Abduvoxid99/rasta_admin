export default function parseQuery (_query) {
  let query = _query || window.location.search
  var search = query.substring(1);
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}