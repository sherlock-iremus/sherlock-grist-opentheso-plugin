// Source - https://stackoverflow.com/a/10710406
// Posted by Phrogz, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-04, License - CC BY-SA 3.0
export const indexesOf = (element: any, array: any[]) => {
  var a=[],i=-1;
  while((i=array.indexOf(element,i+1)) >= 0) a.push(i);
  return a;
}