import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONFIG = JSON.parse(fs.readFileSync('./site-config.json', 'utf8'));
const TEMPLATE = fs.readFileSync('./templates/post-layout.html', 'utf8');
const CONTENT_DIR = './content';
const OUTPUT_DIR = './public/posts'; // Vercel public dir

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function generateStaticPage(data, collection) {
    let html = TEMPLATE;
    const replacements = {
        '{{title}}': data.title,
        '{{description}}': data.description || data.motive || '',
        '{{image}}': data.image || CONFIG.seo.defaultOgImage,
        '{{siteName}}': CONFIG.siteName,
        '{{date}}': data.date ? new Date(data.date).toLocaleDateString() : '',
        '{{year}}': new Date().getFullYear(),
        '{{url}}': `${CONFIG.seo.baseUrl}/posts/${collection}/${data.id}.html`,
        '{{{body}}}': marked(data.rawBody || ''),
        '{{{treatment}}}': marked(data.treatment || ''),
        '{{{evolution}}}': marked(data.evolution || '')
    };

    Object.keys(replacements).forEach(key => {
        html = html.split(key).join(replacements[key]);
    });

    const dir = path.join(OUTPUT_DIR, collection);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${data.id}.html`), html);
}

function build() {
    console.log(`🛠️  Building [${CONFIG.siteName}]...`);
    const collections = ['noticias', 'casos-clinicos'];
    const index = { noticias: [], 'casos-clinicos': [] };

    collections.forEach(col => {
        const dir = path.join(CONTENT_DIR, col);
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
        files.forEach(file => {
            const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
            if (data.draft) return;

            const entry = { ...data, id: file.replace('.md', ''), rawBody: content };
            generateStaticPage(entry, col);
            
            // For JSON index
            index[col].push({
                ...data,
                id: entry.id,
                url: `/posts/${col}/${entry.id}.html`
            });
        });
    });

    fs.writeFileSync('./content.json', JSON.stringify(index, null, 2));
    console.log('✅ Build Finished. Static pages generated in /public/posts');
}

build();
