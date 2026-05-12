import { lazy } from 'react';
import {
  Shield,
  Link as LinkIcon,
  Binary,
  QrCode,
  ImagePlus,
  ImageIcon,
  Braces,
  ArrowLeftRight,
  FileJson,
  FileText,
  Diff,
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

// All tool components are route-level lazy chunks. The home/category pages
// only ever read metadata from this registry; the component module is fetched
// on demand when the user lands on /tools/<slug>.

// Security
const Base64 = lazy(() => import('@/tools/security/Base64'));
const PasswordStrength = lazy(() => import('@/tools/security/PasswordStrength'));
const UrlEncode = lazy(() => import('@/tools/security/UrlEncode'));

// Image
const QrCodeTool = lazy(() => import('@/tools/image/QrCode'));
const Favicon = lazy(() => import('@/tools/image/Favicon'));
const ImageConvert = lazy(() => import('@/tools/image/ImageConvert'));

// Format
const JsonFormat = lazy(() => import('@/tools/format/JsonFormat'));
const JsonConvert = lazy(() => import('@/tools/format/JsonConvert'));
const JsonDiff = lazy(() => import('@/tools/format/JsonDiff'));
const JsonToGo = lazy(() => import('@/tools/format/JsonToGo'));

// Text
const CaseConvert = lazy(() => import('@/tools/text/CaseConvert'));
const RegexTester = lazy(() => import('@/tools/text/RegexTester'));
const Crontab = lazy(() => import('@/tools/text/Crontab'));
const ColorConvert = lazy(() => import('@/tools/text/ColorConvert'));
const TextStats = lazy(() => import('@/tools/text/TextStats'));
const DateTime = lazy(() => import('@/tools/text/DateTime'));
const CurlBuilder = lazy(() => import('@/tools/text/CurlBuilder'));

// Cheatsheets
const GitCheatsheet = lazy(() => import('@/tools/cheatsheet/GitCheatsheet'));
const SshCheatsheet = lazy(() => import('@/tools/cheatsheet/SshCheatsheet'));
const VimCheatsheet = lazy(() => import('@/tools/cheatsheet/VimCheatsheet'));
const HttpStatus = lazy(() => import('@/tools/cheatsheet/HttpStatus'));
const SqlCheatsheet = lazy(() => import('@/tools/cheatsheet/SqlCheatsheet'));
const TarCheatsheet = lazy(() => import('@/tools/cheatsheet/TarCheatsheet'));

export const TOOLS: ToolMeta[] = [
  // ========== Security (3) ==========
  {
    slug: 'base64',
    category: 'security',
    i18nKey: 'base64',
    icon: Binary,
    component: Base64,
    keywords: ['base64', 'encode', 'decode', '编码'],
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

  // ========== Format (4) ==========
  {
    slug: 'json-format',
    category: 'format',
    i18nKey: 'json-format',
    icon: Braces,
    component: JsonFormat,
    keywords: ['json', 'format', 'pretty'],
  },
  {
    slug: 'json-convert',
    category: 'format',
    i18nKey: 'json-convert',
    icon: ArrowLeftRight,
    component: JsonConvert,
    keywords: ['json', 'yaml', 'xml', 'toml', 'csv', 'convert'],
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
