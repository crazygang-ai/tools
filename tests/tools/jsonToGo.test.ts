import { describe, expect, it } from 'vitest';
import { jsonToGo } from '@/tools/format/jsonToGo.lib';

describe('json to go', () => {
  it('generates struct from object', () => {
    const out = jsonToGo('{"name":"alice","age":30}', 'User');
    expect(out).toContain('type User struct');
    expect(out).toContain('Name string `json:"name"`');
    expect(out).toContain('Age int64 `json:"age"`');
  });
  it('handles nested object', () => {
    const out = jsonToGo('{"u":{"x":1}}', 'Root');
    expect(out).toContain('type Root struct');
    expect(out).toContain('type U struct');
  });
  it('handles array of objects', () => {
    const out = jsonToGo('[{"id":1}]', 'Item');
    expect(out).toContain('type Item struct');
    expect(out).toContain('type ItemList []Item');
  });
  it('throws on invalid json', () => {
    expect(() => jsonToGo('not json')).toThrow();
  });
});
