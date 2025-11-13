#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = ['.ts', '.tsx', '.js', '.jsx'];

function walk(dir) {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      results.push(...walk(fp));
    } else if (exts.includes(path.extname(name))) {
      results.push(fp);
    }
  }
  return results;
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  const orig = src;
  const lines = src.split(/\r?\n/);
  // Collect import blocks (support multi-line imports)
  const importRanges = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*import\b/.test(line)) {
      let j = i;
      // continue until semicolon or line not ending with comma or open brace not closed
      while (j < lines.length && !/;\s*$/.test(lines[j])) j++;
      importRanges.push([i, j]);
      i = j;
    }
  }

  // Process imports from bottom to top to avoid index shifts
  for (let idx = importRanges.length - 1; idx >= 0; idx--) {
    const [start, end] = importRanges[idx];
    const block = lines.slice(start, end + 1).join('\n');
    // skip side-effect imports like: import './styles.css'
    if (/^\s*import\s+['"].+['"];?\s*$/.test(block)) continue;

    // Parse import parts
    const m = block.match(/^\s*import\s+(.*?)\s+from\s+['"][^'"]+['"]\s*;?$/s);
    if (!m) continue;
    const decl = m[1].trim();

    // Determine specifiers
    let rebuilt = null;

    if (/^\*\s+as\s+([A-Za-z_$][\w$]*)$/.test(decl)) {
      const name = decl.replace(/^\*\s+as\s+/, '');
      const regex = new RegExp('\\b' + name + '\\.');
      if (regex.test(src.replace(block, ''))) {
        // used
      } else {
        // remove whole import
        lines.splice(start, end - start + 1);
        continue;
      }
    } else {
      // default import + named
      let defaultImport = null;
      let namedPart = null;
      if (/^[A-Za-z_$][\w$]*\s*,\s*\{[\s\S]+\}$/.test(decl)) {
        const k = decl.indexOf(',');
        defaultImport = decl.slice(0, k).trim();
        namedPart = decl.slice(k + 1).trim();
      } else if (/^\{[\s\S]+\}$/.test(decl)) {
        namedPart = decl;
      } else if (/^[A-Za-z_$][\w$]*$/.test(decl)) {
        defaultImport = decl;
      } else if (/^type\s+\{[\s\S]+\}$/.test(decl)) {
        namedPart = decl.replace(/^type\s+/, '');
      } else if (/^type\s+[A-Za-z_$][\w$]*$/.test(decl)) {
        defaultImport = decl.replace(/^type\s+/, '');
      }

      if (defaultImport) {
        const name = defaultImport.replace(/\s*type\s*/, '').trim();
        const regex = new RegExp('\\b' + name + '\\b');
        const rest = src.replace(block, '');
        if (!regex.test(rest)) {
          defaultImport = null; // drop
        }
      }

      if (namedPart) {
        const namesRaw = namedPart.replace(/^type\s*/,'').replace(/^{|}$/g,'').trim();
        const parts = namesRaw.split(',').map(s=>s.trim()).filter(Boolean);
        const rest = src.replace(block, '');
        const kept = [];
        for (const p of parts) {
          const asMatch = p.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
          let localName = p;
          if (asMatch) localName = asMatch[2];
          const nameRegex = new RegExp('\\b' + localName + '\\b');
          if (nameRegex.test(rest)) kept.push(p);
        }
        if (kept.length > 0) namedPart = '{ ' + kept.join(', ') + ' }';
        else namedPart = null;
      }

      if (!defaultImport && !namedPart) {
        // remove whole import
        lines.splice(start, end - start + 1);
        continue;
      }

      const partsList = [];
      if (defaultImport) partsList.push(defaultImport);
      if (namedPart) partsList.push(namedPart);
      const fromMatch = block.match(/from\s+(['"][^'"]+['"])/);
      const fromPart = fromMatch ? fromMatch[1] : "''";
      rebuilt = 'import ' + partsList.join(', ') + ' from ' + fromPart + ';';
      lines.splice(start, end - start + 1, rebuilt);
    }
  }

  const out = lines.join('\n');
  if (out !== orig) {
    fs.writeFileSync(file, out, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const files = walk(root);
  let changed = 0;
  for (const f of files) {
    try {
      if (processFile(f)) changed++;
    } catch (err) {
      console.error('ERR', f, err.message);
    }
  }
  console.log('Processed', files.length, 'files, changed', changed);
}

main();
