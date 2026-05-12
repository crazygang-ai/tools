/**
 * Convert JSON to Go struct definitions.
 * Naive but covers common cases: nested objects, arrays, primitives.
 */

type Json = unknown;

function pascal(name: string): string {
  return name
    .replace(/[^A-Za-z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase());
}

function goType(value: Json, fieldName: string, structs: Map<string, string>): string {
  if (value === null) return 'interface{}';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int64' : 'float64';
  if (typeof value === 'string') return 'string';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]interface{}';
    // pick first element's type; Go is monomorphic, so we sample the head
    return '[]' + goType(value[0], fieldName, structs);
  }
  if (typeof value === 'object') {
    const name = pascal(fieldName) || 'Root';
    buildStruct(value as Record<string, Json>, name, structs);
    return name;
  }
  return 'interface{}';
}

function buildStruct(
  obj: Record<string, Json>,
  name: string,
  structs: Map<string, string>,
): void {
  const lines: string[] = [`type ${name} struct {`];
  for (const [key, val] of Object.entries(obj)) {
    const field = pascal(key);
    const typ = goType(val, key, structs);
    lines.push(`\t${field} ${typ} \`json:"${key}"\``);
  }
  lines.push('}');
  structs.set(name, lines.join('\n'));
}

export function jsonToGo(json: string, rootName = 'Root'): string {
  const value = JSON.parse(json);
  const structs = new Map<string, string>();
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      buildStruct(value[0] as Record<string, Json>, rootName, structs);
      return Array.from(structs.values()).join('\n\n') + `\n\ntype ${rootName}List []${rootName}\n`;
    }
    return `type ${rootName} []${goType(value[0] ?? null, '', structs)}\n`;
  }
  if (typeof value === 'object' && value !== null) {
    buildStruct(value as Record<string, Json>, rootName, structs);
    return Array.from(structs.values()).reverse().join('\n\n') + '\n';
  }
  return `type ${rootName} ${goType(value, '', structs)}\n`;
}
