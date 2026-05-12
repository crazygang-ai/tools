import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format as sqlFormat, type SqlLanguage } from 'sql-formatter';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

const DIALECTS: SqlLanguage[] = [
  'sql',
  'mysql',
  'postgresql',
  'sqlite',
  'mariadb',
  'bigquery',
  'redshift',
  'snowflake',
  'tsql',
  'spark',
  'trino',
];

export default function SqlFormatTool() {
  const { t } = useTranslation();
  const [dialect, setDialect] = useState<SqlLanguage>('sql');
  const [indent, setIndent] = useState(2);
  const [upper, setUpper] = useState(true);
  const [input, setInput] = useState('');

  const output = useMemo(() => {
    if (!input.trim()) return '';
    try {
      return sqlFormat(input, {
        language: dialect,
        tabWidth: indent,
        keywordCase: upper ? 'upper' : 'lower',
      });
    } catch (e) {
      return `-- Error: ${(e as Error).message}`;
    }
  }, [input, dialect, indent, upper]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <FieldHeader label={t('sql-format.dialect', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={dialect}
            onChange={(e) => setDialect(e.target.value as SqlLanguage)}
          >
            {DIALECTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldHeader label={t('sql-format.indent', { ns: 'tools' })} />
          <select
            className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm"
            value={indent}
            onChange={(e) => setIndent(parseInt(e.target.value, 10))}
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
          </select>
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={upper}
            onChange={(e) => setUpper(e.target.checked)}
          />
          {t('sql-format.uppercase', { ns: 'tools' })}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <FieldHeader label={t('common.input')} />
          <Textarea
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="select id, name from users where age > 18 order by name"
          />
        </div>
        <div>
          <FieldHeader
            label={t('common.output')}
            action={<CopyButton value={output} />}
          />
          <Textarea rows={14} readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
