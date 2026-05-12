import { CheatsheetTable } from './CheatsheetTable';

const sections = [
  {
    key: 'connect',
    rows: [
      { cmd: 'ssh user@host', zh: '连接服务器', en: 'Connect to server' },
      { cmd: 'ssh -p 2222 user@host', zh: '指定端口', en: 'Custom port' },
      { cmd: 'ssh -i ~/.ssh/key.pem user@host', zh: '指定密钥', en: 'Use a specific key' },
      { cmd: 'ssh -L 8080:localhost:80 user@host', zh: '本地端口转发', en: 'Local port forward' },
      { cmd: 'ssh -R 8080:localhost:80 user@host', zh: '远程端口转发', en: 'Remote port forward' },
      { cmd: 'ssh -D 1080 user@host', zh: '动态 SOCKS 代理', en: 'Dynamic SOCKS proxy' },
      { cmd: 'ssh -A user@host', zh: '转发 ssh-agent', en: 'Forward ssh-agent' },
    ],
  },
  {
    key: 'key',
    rows: [
      { cmd: 'ssh-keygen -t ed25519 -C "you@example.com"', zh: '生成 ed25519 密钥', en: 'Generate ed25519 key' },
      { cmd: 'ssh-copy-id user@host', zh: '免密登录', en: 'Install pubkey on server' },
      { cmd: 'ssh-add ~/.ssh/id_ed25519', zh: '添加到 agent', en: 'Add key to agent' },
      { cmd: 'ssh-add -l', zh: '查看 agent 中密钥', en: 'List keys in agent' },
      { cmd: 'ssh-keygen -lf <key>', zh: '查看指纹', en: 'Show fingerprint' },
    ],
  },
  {
    key: 'transfer',
    rows: [
      { cmd: 'scp file user@host:/path', zh: '上传文件', en: 'Upload file' },
      { cmd: 'scp user@host:/path/file ./', zh: '下载文件', en: 'Download file' },
      { cmd: 'scp -r dir user@host:/path', zh: '递归上传', en: 'Recursive upload' },
      { cmd: 'rsync -avz src/ user@host:dst/', zh: '增量同步', en: 'Incremental sync' },
      { cmd: 'sftp user@host', zh: '交互式 SFTP', en: 'Interactive SFTP' },
    ],
  },
  {
    key: 'config',
    rows: [
      { cmd: 'cat ~/.ssh/config', zh: '客户端配置', en: 'Client config' },
      { cmd: 'Host alias / HostName / User', zh: 'Host 别名片段', en: 'Host alias snippet' },
      { cmd: 'systemctl restart sshd', zh: '重启服务端', en: 'Restart sshd' },
      { cmd: 'ssh -v user@host', zh: '调试连接', en: 'Verbose connection log' },
    ],
  },
];

export default function SshCheatsheet() {
  return <CheatsheetTable ns="ssh-cheatsheet" sections={sections} />;
}
