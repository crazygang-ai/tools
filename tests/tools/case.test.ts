import { describe, expect, it } from 'vitest';
import { cases } from '@/tools/text/case.lib';

describe('case conversions', () => {
  const input = 'hello world dev tools';
  it('camel', () => expect(cases.camel(input)).toBe('helloWorldDevTools'));
  it('pascal', () => expect(cases.pascal(input)).toBe('HelloWorldDevTools'));
  it('snake', () => expect(cases.snake(input)).toBe('hello_world_dev_tools'));
  it('kebab', () => expect(cases.kebab(input)).toBe('hello-world-dev-tools'));
  it('constant', () => expect(cases.constant(input)).toBe('HELLO_WORLD_DEV_TOOLS'));
  it('title', () => expect(cases.title(input)).toBe('Hello World Dev Tools'));
  it('sentence', () =>
    expect(cases.sentence(input)).toBe('Hello world dev tools'));

  it('handles camelCase + acronyms', () => {
    expect(cases.snake('myXMLParser')).toBe('my_xml_parser');
    expect(cases.kebab('parseHTTPRequest')).toBe('parse-http-request');
  });

  it('handles separators', () => {
    expect(cases.camel('foo-bar_baz')).toBe('fooBarBaz');
    expect(cases.kebab('Foo Bar Baz')).toBe('foo-bar-baz');
  });

  it('empty', () => expect(cases.camel('')).toBe(''));
});
