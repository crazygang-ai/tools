import { CheatsheetTable } from './CheatsheetTable';

const sections = [
  {
    key: 'mode',
    rows: [
      { cmd: 'i', zh: '插入模式', en: 'Insert mode' },
      { cmd: 'a', zh: '光标后插入', en: 'Append after cursor' },
      { cmd: 'o / O', zh: '下方/上方新行并进入插入', en: 'New line below / above & insert' },
      { cmd: 'Esc / Ctrl-[', zh: '回到普通模式', en: 'Back to normal mode' },
      { cmd: 'v / V / Ctrl-v', zh: '可视/行/块选择', en: 'Visual / line / block select' },
      { cmd: ':', zh: '命令模式', en: 'Command-line mode' },
    ],
  },
  {
    key: 'move',
    rows: [
      { cmd: 'h j k l', zh: '左下上右', en: 'Left / down / up / right' },
      { cmd: 'w / b / e', zh: '词级跳转', en: 'Word forward / back / end' },
      { cmd: '0 / ^ / $', zh: '行首/首字符/行尾', en: 'Line start / first char / end' },
      { cmd: 'gg / G', zh: '文件首/尾', en: 'File start / end' },
      { cmd: ':<n>', zh: '跳转到第 n 行', en: 'Jump to line n' },
      { cmd: 'Ctrl-d / Ctrl-u', zh: '半屏下/上', en: 'Half page down / up' },
      { cmd: '%', zh: '匹配的括号', en: 'Matching bracket' },
    ],
  },
  {
    key: 'edit',
    rows: [
      { cmd: 'dd / D', zh: '删除整行/到行尾', en: 'Delete line / to end of line' },
      { cmd: 'yy / Y', zh: '复制整行', en: 'Yank line' },
      { cmd: 'p / P', zh: '粘贴下/上', en: 'Paste after / before' },
      { cmd: 'u / Ctrl-r', zh: '撤销 / 重做', en: 'Undo / redo' },
      { cmd: '. (dot)', zh: '重复上次操作', en: 'Repeat last change' },
      { cmd: 'ciw / cit / ci"', zh: '改单词/标签内/引号内', en: 'Change inner word / tag / quote' },
      { cmd: '>> / <<', zh: '行缩进/反缩进', en: 'Indent / outdent line' },
    ],
  },
  {
    key: 'search',
    rows: [
      { cmd: '/word', zh: '向下搜索', en: 'Search forward' },
      { cmd: '?word', zh: '向上搜索', en: 'Search backward' },
      { cmd: 'n / N', zh: '下/上一个匹配', en: 'Next / previous match' },
      { cmd: '*', zh: '搜光标处单词', en: 'Search word under cursor' },
      { cmd: ':%s/old/new/g', zh: '全文替换', en: 'Replace globally' },
      { cmd: ':%s/old/new/gc', zh: '逐个确认替换', en: 'Replace with confirm' },
    ],
  },
  {
    key: 'file',
    rows: [
      { cmd: ':w / :wq / :q!', zh: '保存 / 保存退出 / 强退', en: 'Save / save+quit / force quit' },
      { cmd: ':e <file>', zh: '打开文件', en: 'Edit a file' },
      { cmd: ':sp / :vsp', zh: '水平/垂直分屏', en: 'Split horizontally / vertically' },
      { cmd: 'Ctrl-w h/j/k/l', zh: '窗口切换', en: 'Switch window' },
      { cmd: ':bn / :bp / :bd', zh: '下/上一个/关闭 buffer', en: 'Next / previous / close buffer' },
      { cmd: ':!<cmd>', zh: '执行 shell 命令', en: 'Run shell command' },
    ],
  },
];

export default function VimCheatsheet() {
  return <CheatsheetTable ns="vim-cheatsheet" sections={sections} />;
}
