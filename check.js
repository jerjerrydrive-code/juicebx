
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
let depth = 0;
const stack = [];
const regex = /<div([^>]*)>|<\/div>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  if (match[0] === '</div>') {
    if (stack.length === 0) { console.log('Extra </div> at', match.index); continue; }
    const popped = stack.pop();
    if (popped.id && ['app-container', 'view-home', 'view-search', 'view-player-deck', 'view-library', 'view-settings', 'mini-player'].includes(popped.id)) {
      console.log(popped.id, 'closed at depth', depth);
    }
    depth--;
  } else {
    depth++;
    let idMatch = match[1].match(/id=[\x22\x27]([^\x22\x27]+)[\x22\x27]/);
    let id = idMatch ? idMatch[1] : null;
    stack.push({ id, depth });
    if (id && ['app-container', 'view-home', 'view-search', 'view-player-deck', 'view-library', 'view-settings', 'mini-player'].includes(id)) {
      console.log(id, 'opened at depth', depth);
    }
  }
}
console.log('Final depth:', depth);

