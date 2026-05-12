import beautify from 'js-beautify';
import { useTranslation } from 'react-i18next';
import { FormatTool } from '@/components/FormatTool';

export default function HtmlFormat() {
  const { t } = useTranslation();
  return (
    <FormatTool
      ns="html-format"
      format={(s, indent) =>
        beautify.html(s, { indent_size: indent, wrap_line_length: 0, end_with_newline: true })
      }
      minify={(s) => s.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()}
      placeholder={t('html-format.placeholder', { ns: 'tools' })}
    />
  );
}
