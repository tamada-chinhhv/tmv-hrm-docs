/**
 * Split role-based README markdown into Docusaurus docs (vi / en / ja).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const LOCALES = [
  { locale: 'vi', readme: 'README.vi.md', outDir: 'docs' },
  {
    locale: 'en',
    readme: 'README.en.md',
    outDir: 'i18n/en/docusaurus-plugin-content-docs/current',
  },
  {
    locale: 'ja',
    readme: 'README.md',
    outDir: 'i18n/ja/docusaurus-plugin-content-docs/current',
  },
];

const SKIP_SECTIONS = [/^table of contents|^mục lục|^目次/i];

/** Top-level ## sections */
const TOP_MAP = [
  { match: /^quick\s*start|^bắt\s*đầu|^クイック/i, file: 'quick-start', position: 2 },
  { match: /^1\./, file: 'intro', position: 1 },
  { match: /^2\./, splitSubs: true, subPrefix: '2', position: 10 },
  { match: /^3\./, splitSubs: true, subPrefix: '3', position: 20 },
  { match: /^4\./, splitSubs: true, subPrefix: '4', position: 30 },
  { match: /^5\./, file: 'faq', position: 40 },
  { match: /^6\./, file: 'appendix/technical-reference', position: 50 },
];

/** ### subsections under ## 2 / 3 / 4 */
const SUB_MAP = {
  '2': [
    { match: /^2\.1/, file: 'for-employees/login-and-account' },
    { match: /^2\.2/, file: 'for-employees/overview' },
    { match: /^2\.3/, file: 'for-employees/check-in-out' },
    { match: /^2\.4/, file: 'for-employees/leave' },
    { match: /^2\.5/, file: 'for-employees/calendar' },
    { match: /^2\.6/, file: 'for-employees/payslip' },
  ],
  '3': [
    { match: /^3\.1/, file: 'for-managers/team-attendance' },
    { match: /^3\.2/, file: 'for-managers/approve-leave' },
    { match: /^3\.3/, file: 'for-managers/create-overtime-batch' },
    { match: /^3\.4/, file: 'for-managers/approve-overtime' },
  ],
  '4': [
    { match: /^4\.1/, file: 'for-hr-admin/employees' },
    { match: /^4\.2/, file: 'for-hr-admin/documents' },
    { match: /^4\.3/, file: 'for-hr-admin/payroll' },
    { match: /^4\.4/, file: 'for-hr-admin/system-settings' },
    { match: /^4\.5/, file: 'for-hr-admin/overtime-setup' },
    { match: /^4\.6/, file: 'for-hr-admin/hieu-hi' },
    { match: /^4\.7/, file: 'for-hr-admin/permissions-overview' },
    { match: /^4\.8/, file: 'for-hr-admin/month-end' },
  ],
};

const DOC_LINKS = {
  '6-phụ-lục-kỹ-thuật': 'appendix/technical-reference',
  '6-technical-appendix': 'appendix/technical-reference',
  '6-技術付録': 'appendix/technical-reference',
  '1-giới-thiệu': 'intro',
  '1-introduction': 'intro',
  '1-はじめに': 'intro',
  '2-dành-cho-nhân-viên': 'for-employees/login-and-account',
  '2-for-employees': 'for-employees/login-and-account',
  '2-従業員向け': 'for-employees/login-and-account',
  '3-dành-cho-quản-lý': 'for-managers/team-attendance',
  '3-for-managers': 'for-managers/team-attendance',
  '3-マネージャー向け': 'for-managers/team-attendance',
  '4-dành-cho-hr--admin': 'for-hr-admin/employees',
  '4-for-hr--admin': 'for-hr-admin/employees',
  '4-hr--管理者向け': 'for-hr-admin/employees',
  '5-câu-hỏi-thường-gặp': 'faq',
  '5-faq': 'faq',
  '5-よくある質問': 'faq',
};

function stripPreamble(content) {
  const lines = content.split('\n');
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      start = i;
      break;
    }
  }
  return lines.slice(start).join('\n');
}

function cleanTitle(text) {
  return text.replace(/^\d+(?:\.\d+)*\.?\s*/, '').trim();
}

function demoteHeadings(content, levels = 1) {
  return content
    .split('\n')
    .map((line) => {
      const m = line.match(/^(#{2,6})\s+(.*)$/);
      if (!m) return line;
      const newLevel = Math.min(m[1].length + levels, 6);
      return `${'#'.repeat(newLevel)} ${m[2]}`;
    })
    .join('\n');
}

function toDocLink(docPath) {
  return `/docs/${docPath}`;
}

function fixLinks(content) {
  let result = content;
  for (const [anchor, docPath] of Object.entries(DOC_LINKS)) {
    const re = new RegExp(`\\]\\([^)]*#${anchor}[^)]*\\)`, 'gi');
    result = result.replace(re, `](${toDocLink(docPath)})`);
  }
  result = result.replace(/\]\(#(\d+)[^)]*\)/g, (_, num) => {
    const map = {
      1: 'intro',
      2: 'for-employees/login-and-account',
      3: 'for-managers/team-attendance',
      4: 'for-hr-admin/employees',
      5: 'faq',
      6: 'appendix/technical-reference',
    };
    return map[num] ? `](${toDocLink(map[num])})` : '](#)';
  });
  result = result.replace(/\]\(\.\/README[^)]*\)/g, `](${toDocLink('intro')})`);
  return result;
}

function convertAdmonitions(content) {
  return content.replace(
    /^>\s+\*\*(Note|Lưu ý|注意|Warning|Cảnh báo|警告|Important|Quan trọng|重要):\*\*\s*(.*)$/gm,
    (_, type, body) => {
      const lower = type.toLowerCase();
      let kind = 'note';
      if (/warn|cảnh|警告/.test(lower)) kind = 'warning';
      if (/important|quan|重要/.test(lower)) kind = 'info';
      return `:::${kind}\n${body.trim()}\n:::`;
    },
  );
}

function parseH2Sections(content) {
  const sections = [];
  const lines = content.split('\n');
  let current = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const rawHeading = line.replace(/^##\s+/, '').trim();
      if (SKIP_SECTIONS.some((re) => re.test(rawHeading))) {
        current = null;
        continue;
      }
      current = { rawHeading, lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return sections;
}

function splitH3(body, subPrefix) {
  const map = SUB_MAP[subPrefix] || [];
  const parts = [];
  const chunks = body.split(/\n(?=### )/);
  for (const chunk of chunks) {
    const firstLine = chunk.split('\n')[0] || '';
    if (!firstLine.startsWith('### ')) continue;
    const subTitle = firstLine.replace(/^###\s+/, '').trim();
    const entry = map.find((m) => m.match.test(subTitle));
    if (!entry) continue;
    parts.push({
      file: entry.file,
      title: cleanTitle(subTitle),
      content: chunk.replace(/^###[^\n]*\n?/, '').trim(),
    });
  }
  return parts;
}

function writeDoc(outRoot, relPath, title, body, position) {
  const fullPath = path.join(outRoot, `${relPath}.md`);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const processed = fixLinks(convertAdmonitions(demoteHeadings(body)));
  const frontmatter = `---\nsidebar_position: ${position}\n---\n\n`;
  const heading = `# ${cleanTitle(title)}\n\n`;
  fs.writeFileSync(fullPath, frontmatter + heading + processed + '\n', 'utf8');
}

function clearGeneratedMarkdown(outRoot) {
  if (!fs.existsSync(outRoot)) {
    fs.mkdirSync(outRoot, { recursive: true });
    return;
  }
  for (const entry of fs.readdirSync(outRoot, { withFileTypes: true })) {
    const full = path.join(outRoot, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(full, { recursive: true, force: true });
    } else if (entry.name.endsWith('.md')) {
      fs.unlinkSync(full);
    }
  }
}

function processLocale({ locale, readme, outDir }) {
  const readmePath = path.join(ROOT, readme);
  if (!fs.existsSync(readmePath)) {
    console.warn(`Skip ${locale}: ${readme} not found`);
    return;
  }

  const outRoot = path.join(ROOT, outDir);
  clearGeneratedMarkdown(outRoot);

  const raw = fs.readFileSync(readmePath, 'utf8');
  const sections = parseH2Sections(stripPreamble(raw));
  let written = 0;

  for (const section of sections) {
    const mapping = TOP_MAP.find((e) => e.match.test(section.rawHeading));
    if (!mapping) continue;

    const body = section.lines.join('\n').trim();

    if (mapping.splitSubs) {
      const parts = splitH3(body, mapping.subPrefix);
      let pos = mapping.position;
      for (const part of parts) {
        writeDoc(outRoot, part.file, part.title, part.content, pos++);
        written += 1;
      }
      continue;
    }

    writeDoc(outRoot, mapping.file, section.rawHeading, body, mapping.position);
    written += 1;
  }

  console.log(`✓ ${locale}: wrote ${written} pages → ${outDir}`);
}

for (const locale of LOCALES) {
  processLocale(locale);
}

console.log('Done.');
