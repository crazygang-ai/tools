import { lazy } from 'react';
import {
  Lock,
  KeyRound,
  Fingerprint,
  ShieldCheck,
  Shield,
  Link as LinkIcon,
  Ticket,
  Hash as HashIcon,
  Binary,
  QrCode,
  ImagePlus,
  ImageIcon,
  Braces,
  ArrowLeftRight,
  FileJson,
  FileCode,
  FileText,
  Diff,
  Code2,
  Database,
  Code,
  Regex,
  CalendarClock,
  Palette,
  AlignLeft,
  Clock,
  Terminal,
  GitBranch,
  Server,
  Lightbulb,
  HardDrive,
} from 'lucide-react';
import type { ToolMeta } from '@/types';

// Lazy-loaded tool components — first batch (kept)
const Base64 = lazy(() => import('@/tools/security/Base64'));
const JwtDecode = lazy(() => import('@/tools/security/JwtDecode'));
const QrCodeTool = lazy(() => import('@/tools/image/QrCode'));
const JsonFormat = lazy(() => import('@/tools/format/JsonFormat'));
const JsonYaml = lazy(() => import('@/tools/format/JsonYaml'));
const CaseConvert = lazy(() => import('@/tools/text/CaseConvert'));
const RegexTester = lazy(() => import('@/tools/text/RegexTester'));
const GitCheatsheet = lazy(() => import('@/tools/cheatsheet/GitCheatsheet'));

// Second batch — security
const HashText = lazy(() => import('@/tools/security/HashText'));
const Bcrypt = lazy(() => import('@/tools/security/Bcrypt'));
const EncryptDecrypt = lazy(() => import('@/tools/security/EncryptDecrypt'));
const Hmac = lazy(() => import('@/tools/security/Hmac'));
const RsaKeypair = lazy(() => import('@/tools/security/RsaKeypair'));
const PasswordStrength = lazy(() => import('@/tools/security/PasswordStrength'));
const UrlEncode = lazy(() => import('@/tools/security/UrlEncode'));
const TokenGen = lazy(() => import('@/tools/security/TokenGen'));

// Image
const Favicon = lazy(() => import('@/tools/image/Favicon'));
const ImageConvert = lazy(() => import('@/tools/image/ImageConvert'));

// Format
const JsonXml = lazy(() => import('@/tools/format/JsonXml'));
const JsonToml = lazy(() => import('@/tools/format/JsonToml'));
const JsonCsv = lazy(() => import('@/tools/format/JsonCsv'));
const JsonDiff = lazy(() => import('@/tools/format/JsonDiff'));
const HtmlFormat = lazy(() => import('@/tools/format/HtmlFormat'));
const CssFormat = lazy(() => import('@/tools/format/CssFormat'));
const JsFormat = lazy(() => import('@/tools/format/JsFormat'));
const SqlFormat = lazy(() => import('@/tools/format/SqlFormat'));
const JsonToGo = lazy(() => import('@/tools/format/JsonToGo'));

// Text
const Crontab = lazy(() => import('@/tools/text/Crontab'));
const ColorConvert = lazy(() => import('@/tools/text/ColorConvert'));
const TextStats = lazy(() => import('@/tools/text/TextStats'));
const DateTime = lazy(() => import('@/tools/text/DateTime'));
const CurlBuilder = lazy(() => import('@/tools/text/CurlBuilder'));

// Cheatsheets
const SshCheatsheet = lazy(() => import('@/tools/cheatsheet/SshCheatsheet'));
const VimCheatsheet = lazy(() => import('@/tools/cheatsheet/VimCheatsheet'));
const HttpStatus = lazy(() => import('@/tools/cheatsheet/HttpStatus'));
const SqlCheatsheet = lazy(() => import('@/tools/cheatsheet/SqlCheatsheet'));
const TarCheatsheet = lazy(() => import('@/tools/cheatsheet/TarCheatsheet'));

export const TOOLS: ToolMeta[] = [
  // ========== Security (10) ==========
  {
    slug: 'base64',
    category: 'security',
    i18nKey: 'base64',
    icon: Binary,
    component: Base64,
    keywords: ['base64', 'encode', 'decode', '编码'],
  },
  {
    slug: 'jwt-decode',
    category: 'security',
    i18nKey: 'jwt-decode',
    icon: Ticket,
    component: JwtDecode,
    keywords: ['jwt', 'token', 'decode'],
  },
  {
    slug: 'hash-text',
    category: 'security',
    i18nKey: 'hash-text',
    icon: HashIcon,
    component: HashText,
    keywords: ['hash', 'md5', 'sha', 'sha256'],
  },
  {
    slug: 'bcrypt',
    category: 'security',
    i18nKey: 'bcrypt',
    icon: Lock,
    component: Bcrypt,
    keywords: ['bcrypt', 'password', 'hash'],
  },
  {
    slug: 'encrypt-decrypt',
    category: 'security',
    i18nKey: 'encrypt-decrypt',
    icon: ShieldCheck,
    component: EncryptDecrypt,
    keywords: ['aes', 'encrypt', '加密'],
  },
  {
    slug: 'hmac',
    category: 'security',
    i18nKey: 'hmac',
    icon: Fingerprint,
    component: Hmac,
    keywords: ['hmac', 'sign', '签名'],
  },
  {
    slug: 'rsa-keypair',
    category: 'security',
    i18nKey: 'rsa-keypair',
    icon: KeyRound,
    component: RsaKeypair,
    keywords: ['rsa', 'key', '密钥'],
  },
  {
    slug: 'password-strength',
    category: 'security',
    i18nKey: 'password-strength',
    icon: Shield,
    component: PasswordStrength,
    keywords: ['password', 'strength', '密码'],
  },
  {
    slug: 'url-encode',
    category: 'security',
    i18nKey: 'url-encode',
    icon: LinkIcon,
    component: UrlEncode,
    keywords: ['url', 'encode', 'percent'],
  },
  {
    slug: 'token-gen',
    category: 'security',
    i18nKey: 'token-gen',
    icon: KeyRound,
    component: TokenGen,
    keywords: ['token', 'apikey', 'random'],
  },

  // ========== Image (3) ==========
  {
    slug: 'qr-code',
    category: 'image',
    i18nKey: 'qr-code',
    icon: QrCode,
    component: QrCodeTool,
    keywords: ['qrcode', 'qr', '二维码'],
  },
  {
    slug: 'favicon',
    category: 'image',
    i18nKey: 'favicon',
    icon: ImagePlus,
    component: Favicon,
    keywords: ['favicon', 'icon'],
  },
  {
    slug: 'image-convert',
    category: 'image',
    i18nKey: 'image-convert',
    icon: ImageIcon,
    component: ImageConvert,
    keywords: ['image', 'convert', 'png', 'jpg', 'webp'],
  },

  // ========== Format (11) ==========
  {
    slug: 'json-format',
    category: 'format',
    i18nKey: 'json-format',
    icon: Braces,
    component: JsonFormat,
    keywords: ['json', 'format', 'pretty'],
  },
  {
    slug: 'json-yaml',
    category: 'format',
    i18nKey: 'json-yaml',
    icon: ArrowLeftRight,
    component: JsonYaml,
    keywords: ['json', 'yaml', 'convert'],
  },
  {
    slug: 'json-xml',
    category: 'format',
    i18nKey: 'json-xml',
    icon: ArrowLeftRight,
    component: JsonXml,
    keywords: ['json', 'xml'],
  },
  {
    slug: 'json-toml',
    category: 'format',
    i18nKey: 'json-toml',
    icon: ArrowLeftRight,
    component: JsonToml,
    keywords: ['json', 'toml'],
  },
  {
    slug: 'json-csv',
    category: 'format',
    i18nKey: 'json-csv',
    icon: ArrowLeftRight,
    component: JsonCsv,
    keywords: ['json', 'csv'],
  },
  {
    slug: 'json-diff',
    category: 'format',
    i18nKey: 'json-diff',
    icon: Diff,
    component: JsonDiff,
    keywords: ['json', 'diff', 'compare'],
  },
  {
    slug: 'html-format',
    category: 'format',
    i18nKey: 'html-format',
    icon: FileCode,
    component: HtmlFormat,
    keywords: ['html', 'format'],
  },
  {
    slug: 'css-format',
    category: 'format',
    i18nKey: 'css-format',
    icon: FileCode,
    component: CssFormat,
    keywords: ['css', 'format'],
  },
  {
    slug: 'js-format',
    category: 'format',
    i18nKey: 'js-format',
    icon: Code2,
    component: JsFormat,
    keywords: ['javascript', 'js', 'format'],
  },
  {
    slug: 'sql-format',
    category: 'format',
    i18nKey: 'sql-format',
    icon: Database,
    component: SqlFormat,
    keywords: ['sql', 'format'],
  },
  {
    slug: 'json-to-go',
    category: 'format',
    i18nKey: 'json-to-go',
    icon: FileJson,
    component: JsonToGo,
    keywords: ['json', 'go', 'struct', 'golang'],
  },

  // ========== Text (7) ==========
  {
    slug: 'case-convert',
    category: 'text',
    i18nKey: 'case-convert',
    icon: AlignLeft,
    component: CaseConvert,
    keywords: ['case', 'camel', 'snake', 'kebab'],
  },
  {
    slug: 'regex-tester',
    category: 'text',
    i18nKey: 'regex-tester',
    icon: Regex,
    component: RegexTester,
    keywords: ['regex', 'regexp', '正则'],
  },
  {
    slug: 'crontab',
    category: 'text',
    i18nKey: 'crontab',
    icon: CalendarClock,
    component: Crontab,
    keywords: ['cron', 'crontab', 'schedule'],
  },
  {
    slug: 'color-convert',
    category: 'text',
    i18nKey: 'color-convert',
    icon: Palette,
    component: ColorConvert,
    keywords: ['color', 'hex', 'rgb', 'hsl'],
  },
  {
    slug: 'text-stats',
    category: 'text',
    i18nKey: 'text-stats',
    icon: FileText,
    component: TextStats,
    keywords: ['text', 'stats', 'count'],
  },
  {
    slug: 'datetime',
    category: 'text',
    i18nKey: 'datetime',
    icon: Clock,
    component: DateTime,
    keywords: ['date', 'time', 'unix', 'timestamp'],
  },
  {
    slug: 'curl-builder',
    category: 'text',
    i18nKey: 'curl-builder',
    icon: Terminal,
    component: CurlBuilder,
    keywords: ['curl', 'http', 'request'],
  },

  // ========== Cheatsheet (6) ==========
  {
    slug: 'git-cheatsheet',
    category: 'cheatsheet',
    i18nKey: 'git-cheatsheet',
    icon: GitBranch,
    component: GitCheatsheet,
    keywords: ['git', 'cheatsheet'],
  },
  {
    slug: 'ssh-cheatsheet',
    category: 'cheatsheet',
    i18nKey: 'ssh-cheatsheet',
    icon: Server,
    component: SshCheatsheet,
    keywords: ['ssh', 'cheatsheet'],
  },
  {
    slug: 'vim-cheatsheet',
    category: 'cheatsheet',
    i18nKey: 'vim-cheatsheet',
    icon: Code,
    component: VimCheatsheet,
    keywords: ['vim', 'editor'],
  },
  {
    slug: 'http-status',
    category: 'cheatsheet',
    i18nKey: 'http-status',
    icon: Lightbulb,
    component: HttpStatus,
    keywords: ['http', 'status', 'code'],
  },
  {
    slug: 'sql-cheatsheet',
    category: 'cheatsheet',
    i18nKey: 'sql-cheatsheet',
    icon: Database,
    component: SqlCheatsheet,
    keywords: ['sql', 'cheatsheet'],
  },
  {
    slug: 'tar-cheatsheet',
    category: 'cheatsheet',
    i18nKey: 'tar-cheatsheet',
    icon: HardDrive,
    component: TarCheatsheet,
    keywords: ['tar', 'archive'],
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolMeta['category']): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}
