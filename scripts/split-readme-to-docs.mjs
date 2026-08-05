/**
 * Split README markdown files into Docusaurus doc pages for vi (default), en, ja.
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

/** Map section heading patterns to doc file paths (without .md). */
const SECTION_MAP = [
  { match: /^quick\s*start|^bắt\s*đầu|^クイック/i, file: 'quick-start', position: 2 },
  { match: /^1\./, file: 'intro', position: 1 },
  { match: /^2\./, file: 'requirements', position: 3 },
  { match: /^3\./, file: 'accounts', position: 4 },
  { match: /^4\./, file: 'employee-management', position: 5 },
  { match: /^5\./, file: 'calendar', position: 6 },
  { match: /^6\./, file: 'roles-permissions', position: 7 },
  { match: /^7\./, file: 'module-guides/_section7', position: 8, isModuleSection: true },
  { match: /^8\./, file: 'attendance', position: 9 },
  { match: /^9\./, file: 'leave-requests', position: 10 },
  { match: /^10\./, file: 'reports', position: 11 },
  { match: /^11\./, file: 'operations', position: 12 },
  { match: /^12\./, file: 'faq', position: 13 },
  { match: /^13\./, file: 'handover-checklist', position: 14 },
];

const MODULE_SUB_MAP = [
  { match: /^7\.0/, file: 'module-guides/account' },
  { match: /^7\.1/, file: 'module-guides/overview' },
  { match: /^7\.2\.1/, file: 'module-guides/documents' },
  { match: /^7\.2(?!\.)/, file: 'module-guides/departments' },
  { match: /^7\.4/, file: 'module-guides/payroll' },
  { match: /^7\.5\.1/, file: 'module-guides/system-config' },
  { match: /^7\.5(?!\.)/, file: 'module-guides/system-config' },
];

const SKIP_SECTIONS = [
  /^table of contents|^mục lục|^目次/i,
];

const DOC_LINKS = {
  '8-attendance': 'attendance',
  '8-attendance--leave-reports': 'reports',
  '9-leave-requests': 'leave-requests',
  '10-attendance--leave-reports': 'reports',
  '6-roles--permissions': 'roles-permissions',
  '721-documents-orgdocuments': 'module-guides/documents',
  '70-account-account': 'module-guides/account',
  '751-branch-configuration-gps--wifi': 'module-guides/system-config',
  '104-month-end-reconciliation-hr': 'reports',
  '81-how-it-works': 'attendance',
  '812-web-attendance-gps': 'attendance',
  '81-cơ-chế-chấm-công-của-hệ-thống': 'attendance',
  '81-仕組み': 'attendance',
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

function normalizeTitle(line) {
  return line.replace(/^##\s+/, '').replace(/^\d+\.\s*/, '').trim();
}

function demoteHeadings(content, levels = 1) {
  const prefix = '#'.repeat(levels);
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
    const section = SECTION_MAP.find((s) => s.match.test(`${num}.`));
    return section
      ? `](${toDocLink(section.file.replace('module-guides/_section7', 'module-guides/overview'))})`
      : '](#)';
  });
  result = result.replace(/\]\(\.\/README[^)]*\)/g, `](${toDocLink('intro')})`);
  return result;
}

function convertAdmonitions(content) {
  return content.replace(/^>\s+\*\*(Note|Lưu ý|注意|Warning|Cảnh báo|警告|Important|Quan trọng|重要):\*\*\s*(.*)$/gm, (_, type, body) => {
    const lower = type.toLowerCase();
    let kind = 'note';
    if (/warn|cảnh|警告/.test(lower)) kind = 'warning';
    if (/important|quan|重要/.test(lower)) kind = 'info';
    return `:::${kind}\n${body.trim()}\n:::`;
  });
}

function parseSections(content) {
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
      current = { rawHeading, title: normalizeTitle(line), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return sections;
}

function resolveSectionFile(rawHeading) {
  for (const entry of SECTION_MAP) {
    if (entry.match.test(rawHeading)) return entry;
  }
  return null;
}

function splitModuleSection(section) {
  const body = section.lines.join('\n').trim();
  const parts = [];
  const chunks = body.split(/\n(?=### )/);
  for (const chunk of chunks) {
    const firstLine = chunk.split('\n')[0] || '';
    const subTitle = firstLine.replace(/^###\s+/, '').trim();
    let file = null;
    for (const entry of MODULE_SUB_MAP) {
      if (entry.match.test(subTitle)) {
        file = entry.file;
        break;
      }
    }
    if (!file) continue;
    if (file === 'module-guides/system-config') {
      const existing = parts.find((p) => p.file === file);
      const chunkBody = chunk.replace(/^###[^\n]*\n?/, '').trim();
      if (existing) {
        existing.content += `\n\n## ${subTitle.replace(/^\d+(\.\d+)*\s*/, '')}\n\n${chunkBody}`;
      } else {
        parts.push({
          file,
          title: subTitle.replace(/^\d+(\.\d+)*\s*/, ''),
          content: chunkBody,
        });
      }
    } else {
      parts.push({
        file,
        title: subTitle.replace(/^\d+(\.\d+)*\s*/, ''),
        content: chunk.replace(/^###[^\n]*\n?/, '').trim(),
      });
    }
  }
  return parts;
}

function writeDoc(outRoot, relPath, title, body, position) {
  const fullPath = path.join(outRoot, `${relPath}.md`);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const processed = fixLinks(convertAdmonitions(demoteHeadings(body)));
  const frontmatter = `---\nsidebar_position: ${position}\n---\n\n`;
  const heading = `# ${title.replace(/^\d+(\.\d+)*\s*/, '')}\n\n`;
  fs.writeFileSync(fullPath, frontmatter + heading + processed + '\n', 'utf8');
}

function processLocale({ locale, readme, outDir }) {
  const readmePath = path.join(ROOT, readme);
  if (!fs.existsSync(readmePath)) {
    console.warn(`Skip ${locale}: ${readme} not found`);
    return;
  }

  const outRoot = path.join(ROOT, outDir);
  if (fs.existsSync(outRoot)) {
    fs.rmSync(outRoot, { recursive: true, force: true });
  }
  fs.mkdirSync(outRoot, { recursive: true });

  const raw = fs.readFileSync(readmePath, 'utf8');
  const sections = parseSections(stripPreamble(raw));

  for (const section of sections) {
    const mapping = resolveSectionFile(section.rawHeading);
    if (!mapping) continue;

    const body = section.lines.join('\n').trim();

    if (mapping.isModuleSection) {
      const moduleParts = splitModuleSection(section);
      let pos = mapping.position;
      for (const part of moduleParts) {
        writeDoc(outRoot, part.file, part.title, part.content, pos++);
      }
      continue;
    }

    writeDoc(outRoot, mapping.file, section.title, body, mapping.position);
  }

  console.log(`✓ ${locale}: wrote docs to ${outDir}`);
}

for (const locale of LOCALES) {
  processLocale(locale);
}

console.log('Done.');
