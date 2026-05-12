import { CheatsheetTable } from './CheatsheetTable';

const sections = [
  {
    key: 'create',
    rows: [
      { cmd: 'tar -cvf out.tar dir/', zh: '打包目录', en: 'Create archive' },
      { cmd: 'tar -czvf out.tar.gz dir/', zh: 'gzip 压缩打包', en: 'Create gzip archive' },
      { cmd: 'tar -cjvf out.tar.bz2 dir/', zh: 'bzip2 压缩打包', en: 'Create bzip2 archive' },
      { cmd: 'tar -cJvf out.tar.xz dir/', zh: 'xz 压缩打包', en: 'Create xz archive' },
      { cmd: 'tar -caf out.tar.gz dir/', zh: '按扩展名自动压缩', en: 'Auto-compress by suffix' },
    ],
  },
  {
    key: 'extract',
    rows: [
      { cmd: 'tar -xvf in.tar', zh: '解包', en: 'Extract archive' },
      { cmd: 'tar -xzvf in.tar.gz', zh: '解压 gzip', en: 'Extract gzip' },
      { cmd: 'tar -xjvf in.tar.bz2', zh: '解压 bzip2', en: 'Extract bzip2' },
      { cmd: 'tar -xJvf in.tar.xz', zh: '解压 xz', en: 'Extract xz' },
      { cmd: 'tar -xvf in.tar -C /path', zh: '解压到指定目录', en: 'Extract to directory' },
    ],
  },
  {
    key: 'list',
    rows: [
      { cmd: 'tar -tvf in.tar', zh: '列出内容', en: 'List archive contents' },
      { cmd: 'tar -tzvf in.tar.gz', zh: '列出 gzip 内容', en: 'List gzip contents' },
      { cmd: 'tar -tvf in.tar | grep <name>', zh: '查找成员', en: 'Find member' },
    ],
  },
  {
    key: 'advanced',
    rows: [
      { cmd: 'tar -xvf in.tar <member>', zh: '只解出某文件', en: 'Extract specific member' },
      { cmd: 'tar --exclude="*.log" -czvf out.tgz dir/', zh: '排除文件', en: 'Exclude pattern' },
      { cmd: 'tar -czvf - dir/ | ssh host "cat > out.tgz"', zh: '打包并 SSH 传输', en: 'Pipe through SSH' },
      { cmd: 'tar -df in.tar.gz', zh: '与磁盘比对差异', en: 'Diff archive vs filesystem' },
      { cmd: 'tar --strip-components=1 -xvf in.tar', zh: '剥离顶层目录', en: 'Strip top-level dir' },
    ],
  },
];

export default function TarCheatsheet() {
  return <CheatsheetTable ns="tar-cheatsheet" sections={sections} />;
}
