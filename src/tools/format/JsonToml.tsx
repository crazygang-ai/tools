import { useTranslation } from 'react-i18next';
import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml';
import { BiConvert } from '@/components/BiConvert';

export default function JsonToml() {
  const { t } = useTranslation();
  return (
    <BiConvert
      leftLabel={t('json-toml.json', { ns: 'tools' })}
      rightLabel={t('json-toml.toml', { ns: 'tools' })}
      forward={(s) => tomlStringify(JSON.parse(s))}
      backward={(s) => JSON.stringify(tomlParse(s), null, 2)}
      invalidLeft={t('json-toml.invalidJson', { ns: 'tools' })}
      invalidRight={t('json-toml.invalidToml', { ns: 'tools' })}
      leftPlaceholder='{"name":"DevTools","tools":60}'
      rightPlaceholder='name = "DevTools"'
    />
  );
}
