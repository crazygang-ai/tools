import beautify from 'js-beautify';
import { useTranslation } from 'react-i18next';
import { FormatTool } from '@/components/FormatTool';

export default function CssFormat() {
  const { t } = useTranslation();
  return (
    <FormatTool
      ns="css-format"
      format={(s, indent) => beautify.css(s, { indent_size: indent })}
      minify={(s) =>
        s
          .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
          .replace(/\s+/g, ' ')
          .replace(/\s*([{}:;,>+~])\s*/g, '$1')
          .replace(/;}/g, '}')
          .trim()
      }
      placeholder={t('css-format.placeholder', { ns: 'tools' })}
    />
  );
}
