import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/ui/CopyButton';

interface Row {
  cmd: string;
  zh: string;
  en: string;
}

interface Section {
  key: string;
  rows: Row[];
}

interface Props {
  sections: Section[];
  /** ns key: e.g. 'git-cheatsheet' */
  ns: string;
}

export function CheatsheetTable({ sections, ns }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('zh') ? 'zh' : 'en';
  return (
    <div className="space-y-6">
      {sections.map((s) => (
        <section key={s.key}>
          <h2 className="mb-2 text-sm font-semibold">
            {t(`${ns}.section.${s.key}`, { ns: 'tools' })}
          </h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {s.rows.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0 hover:bg-muted/40"
                  >
                    <td className="w-1/2 px-3 py-2 align-top">
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">
                        {r.cmd}
                      </code>
                    </td>
                    <td className="px-3 py-2 align-top text-muted-fg">{r[lang]}</td>
                    <td className="w-px whitespace-nowrap px-2 py-2 align-top text-right">
                      <CopyButton value={r.cmd} variant="ghost" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
