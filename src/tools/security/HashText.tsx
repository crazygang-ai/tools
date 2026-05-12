import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@/components/ui/Tabs';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FieldHeader } from '@/components/ui/FieldHeader';

type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
const ALGOS: Algo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
  return out;
}

// Pure JS MD5 (compact, not for security; for legacy needs only).
function md5(input: string): string {
  function toBytes(s: string) {
    return new TextEncoder().encode(s);
  }
  function rl(x: number, n: number) {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
  }
  const data = toBytes(input);
  const len = data.length;
  const padLen = (((len + 8) >>> 6) + 1) << 4;
  const M = new Uint32Array(padLen);
  for (let i = 0; i < len; i++) M[i >> 2] |= data[i] << ((i % 4) * 8);
  M[len >> 2] |= 0x80 << ((len % 4) * 8);
  M[padLen - 2] = len * 8;

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const K = [
    3614090360, 3905402710, 606105819, 3250441966, 4118548399, 1200080426, 2821735955, 4249261313,
    1770035416, 2336552879, 4294925233, 2304563134, 1804603682, 4254626195, 2792965006, 1236535329,
    4129170786, 3225465664, 643717713, 3921069994, 3593408605, 38016083, 3634488961, 3889429448,
    568446438, 3275163606, 4107603335, 1163531501, 2850285829, 4243563512, 1735328473, 2368359562,
    4294588738, 2272392833, 1839030562, 4259657740, 2763975236, 1272893353, 4139469664, 3200236656,
    681279174, 3936430074, 3572445317, 76029189, 3654602809, 3873151461, 530742520, 3299628645,
    4096336452, 1126891415, 2878612391, 4237533241, 1700485571, 2399980690, 4293915773, 2240044497,
    1873313359, 4264355552, 2734768916, 1309151649, 4149444226, 3174756917, 718787259, 3951481745,
  ];
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  for (let off = 0; off < padLen; off += 16) {
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[off + g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + rl(F, S[i])) >>> 0;
    }
    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }
  function toHex(n: number) {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += ((n >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return s;
  }
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

export default function HashText() {
  const { t } = useTranslation();
  const [algo, setAlgo] = useState<Algo | 'MD5'>('SHA-256');
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!input) {
        setHash('');
        return;
      }
      if (algo === 'MD5') {
        if (!cancelled) setHash(md5(input));
        return;
      }
      const buf = new TextEncoder().encode(input);
      const digest = await crypto.subtle.digest(algo, buf);
      if (!cancelled) setHash(bufToHex(digest));
    })();
    return () => {
      cancelled = true;
    };
  }, [algo, input]);

  const tabs = useMemo(
    () => (['MD5', ...ALGOS] as const).map((a) => ({ value: a, label: a })),
    [],
  );

  return (
    <div className="space-y-4">
      <Tabs tabs={[...tabs]} value={algo} onChange={setAlgo} />
      <div>
        <FieldHeader label={t('hash-text.input', { ns: 'tools' })} />
        <Textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hello, world"
        />
      </div>
      <div>
        <FieldHeader label={algo} action={<CopyButton value={hash} />} />
        <pre className="overflow-auto rounded-lg border border-border bg-muted p-3 font-mono text-sm break-all whitespace-pre-wrap">
          {hash || '—'}
        </pre>
      </div>
    </div>
  );
}
