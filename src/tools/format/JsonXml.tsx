import { useTranslation } from 'react-i18next';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { BiConvert } from '@/components/BiConvert';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@_', format: true, indentBy: '  ' });

export default function JsonXml() {
  const { t } = useTranslation();
  return (
    <BiConvert
      leftLabel={t('json-xml.json', { ns: 'tools' })}
      rightLabel={t('json-xml.xml', { ns: 'tools' })}
      forward={(s) => builder.build(JSON.parse(s))}
      backward={(s) => JSON.stringify(parser.parse(s), null, 2)}
      invalidLeft={t('json-xml.invalidJson', { ns: 'tools' })}
      invalidRight={t('json-xml.invalidXml', { ns: 'tools' })}
      leftPlaceholder='{"root":{"item":[1,2]}}'
      rightPlaceholder="<root><item>1</item><item>2</item></root>"
    />
  );
}
