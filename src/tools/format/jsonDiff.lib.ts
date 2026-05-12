type Json = unknown;

export interface DiffResult {
  add: number;
  del: number;
  mod: number;
  /** Pretty-printed diff lines */
  lines: string[];
}

export function diffJson(left: Json, right: Json): DiffResult {
  const lines: string[] = [];
  let add = 0, del = 0, mod = 0;

  function walk(a: Json, b: Json, path: string) {
    if (a === undefined && b !== undefined) {
      add++;
      lines.push(`+ ${path}: ${JSON.stringify(b)}`);
      return;
    }
    if (b === undefined && a !== undefined) {
      del++;
      lines.push(`- ${path}: ${JSON.stringify(a)}`);
      return;
    }
    if (typeof a !== typeof b || (a === null) !== (b === null)) {
      mod++;
      lines.push(`~ ${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
      return;
    }
    if (a !== null && typeof a === 'object') {
      const aObj = a as Record<string, Json>;
      const bObj = b as Record<string, Json>;
      const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
      for (const k of keys) {
        walk(aObj[k], bObj[k], path ? `${path}.${k}` : k);
      }
      return;
    }
    if (a !== b) {
      mod++;
      lines.push(`~ ${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
    }
  }

  walk(left, right, '');
  return { add, del, mod, lines };
}
