import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import { BiConvert } from '@/components/BiConvert';

export default function JsonCsv() {
  const { t } = useTranslation();
  return (
    <BiConvert
      leftLabel={t('json-csv.json', { ns: 'tools' })}
      rightLabel={t('json-csv.csv', { ns: 'tools' })}
      forward={(s) => {
        const data = JSON.parse(s);
        if (!Array.isArray(data)) throw new Error('Input must be a JSON array');
        return Papa.unparse(data);
      }}
      backward={(s) => {
        const r = Papa.parse(s.trim(), { header: true, skipEmptyLines: true, dynamicTyping: true });
        if (r.errors.length) throw new Error(r.errors[0].message);
        return JSON.stringify(r.data, null, 2);
      }}
      invalidLeft={t('json-csv.invalidJson', { ns: 'tools' })}
      invalidRight={t('json-csv.invalidCsv', { ns: 'tools' })}
      leftPlaceholder='[{"name":"alice","age":30},{"name":"bob","age":25}]'
      rightPlaceholder="name,age&#10;alice,30&#10;bob,25"
    />
  );
}
