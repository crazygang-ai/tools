import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import yaml from 'js-yaml';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml';
import Papa from 'papaparse';
import { BiConvert } from '@/components/BiConvert';
import { Tabs } from '@/components/ui/Tabs';

type Target = 'yaml' | 'xml' | 'toml' | 'csv';

const TARGETS: Target[] = ['yaml', 'xml', 'toml', 'csv'];

// XML codecs are stateless; build them once at module scope so we don't churn
// new parsers per render.
const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  indentBy: '  ',
});

interface Codec {
  /** JSON string → target format string */
  forward: (json: string) => string;
  /** target format string → JSON string */
  backward: (target: string) => string;
  leftPlaceholder: string;
  rightPlaceholder: string;
}

function csvForward(json: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error('Input must be a JSON array');
  return Papa.unparse(data);
}

function csvBackward(csv: string): string {
  const r = Papa.parse(csv.trim(), { header: true, skipEmptyLines: true, dynamicTyping: true });
  if (r.errors.length) throw new Error(r.errors[0].message);
  return JSON.stringify(r.data, null, 2);
}

const CODECS: Record<Target, Codec> = {
  yaml: {
    forward: (s) => yaml.dump(JSON.parse(s), { lineWidth: 120 }),
    backward: (s) => JSON.stringify(yaml.load(s), null, 2),
    leftPlaceholder: '{"name":"Tools"}',
    rightPlaceholder: 'name: Tools',
  },
  xml: {
    forward: (s) => xmlBuilder.build(JSON.parse(s)),
    backward: (s) => JSON.stringify(xmlParser.parse(s), null, 2),
    leftPlaceholder: '{"root":{"item":[1,2]}}',
    rightPlaceholder: '<root><item>1</item><item>2</item></root>',
  },
  toml: {
    forward: (s) => tomlStringify(JSON.parse(s)),
    backward: (s) => JSON.stringify(tomlParse(s), null, 2),
    leftPlaceholder: '{"name":"Tools","count":23}',
    rightPlaceholder: 'name = "Tools"',
  },
  csv: {
    forward: csvForward,
    backward: csvBackward,
    leftPlaceholder: '[{"name":"alice","age":30},{"name":"bob","age":25}]',
    rightPlaceholder: 'name,age\nalice,30\nbob,25',
  },
};

export default function JsonConvert() {
  const { t } = useTranslation();
  const [target, setTarget] = useState<Target>('yaml');

  const codec = CODECS[target];

  // BiConvert captures `forward` / `backward` props per render and only fires
  // when input changes — useMemo here just keeps the function identity stable
  // for the selected target so React doesn't see prop churn unnecessarily.
  const { forward, backward } = useMemo(
    () => ({ forward: codec.forward, backward: codec.backward }),
    [codec],
  );

  const targetLabel = t(`json-convert.targets.${target}`, { ns: 'tools' });
  const tabs = TARGETS.map((v) => ({
    value: v,
    label: t(`json-convert.targets.${v}`, { ns: 'tools' }),
  }));

  return (
    <div className="space-y-4">
      <Tabs<Target>
        tabs={tabs}
        value={target}
        onChange={setTarget}
        aria-label={t('json-convert.target', { ns: 'tools' })}
      />
      <BiConvert
        // Force a fresh BiConvert instance per target so its internal direction
        // and input state reset — keeps stale text from one format from being
        // fed into another format's parser.
        key={target}
        leftLabel="JSON"
        rightLabel={targetLabel}
        forward={forward}
        backward={backward}
        invalidLeft={t('json-convert.invalidJson', { ns: 'tools' })}
        invalidRight={t('json-convert.invalidTarget', { ns: 'tools', target: targetLabel })}
        leftPlaceholder={codec.leftPlaceholder}
        rightPlaceholder={codec.rightPlaceholder}
      />
    </div>
  );
}
