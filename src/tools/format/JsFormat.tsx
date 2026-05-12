import beautify from 'js-beautify';
import { useTranslation } from 'react-i18next';
import { FormatTool } from '@/components/FormatTool';

export default function JsFormat() {
  const { t } = useTranslation();
  return (
    <FormatTool
      ns="js-format"
      format={(s, indent) => beautify.js(s, { indent_size: indent })}
      minify={(s) =>
        s
          .replace(/\/\/[^\n]*\n/g, '\n')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .replace(/\s*([{}();,:=+\-*/<>!&|])\s*/g, '$1')
          .trim()
      }
      placeholder={t('js-format.placeholder', { ns: 'tools' })}
    />
  );
}
