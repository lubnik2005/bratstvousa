import edjsHTML from 'editorjs-html';

// ============ Type Definitions ============

interface LinkToolBlock {
	data: {
		link: string;
		meta: {
			title: string;
			description: string;
			imageUrl?: string;
		};
	};
}

interface ImageBlock {
	data: {
		file: { url: string };
		caption?: string;
	};
}

interface TableBlock {
	data: {
		withHeadings?: boolean;
		content: string[][];
	};
}

interface RawBlock {
	data: {
		html: string;
	};
}

interface EmbedBlock {
	data: {
		service: string;
		source: string;
		embed: string;
		width?: number;
		height?: number;
		caption?: string;
	};
}

interface EditorJSBlock {
	type: string;
	data: Record<string, unknown>;
}

interface EditorJSData {
	blocks: EditorJSBlock[];
	time?: number;
	version?: string;
}

// ============ Block Parsers ============

/**
 * Link card with preview (linkTool block)
 */
function linkTool(block: LinkToolBlock): string {
	const { link, meta } = block.data;
	return `
<div class="card mb-4 shadow-sm border-0">
  <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-decoration-none text-reset">
    ${meta.imageUrl ? `<img src="${meta.imageUrl}" class="card-img-top" alt="${meta.title}" />` : ''}
    <div class="card-body">
      <h5 class="card-title">${meta.title}</h5>
      <p class="card-text">${meta.description}</p>
      <small class="text-muted">${link}</small>
    </div>
  </a>
</div>`;
}

/**
 * Image with caption and lightbox link
 */
function image(block: ImageBlock): string {
	const { file, caption } = block.data;
	const originalUrl = file.url;
	const smallUrl = originalUrl.replace(/(\.[\w]+)$/, '_small$1');

	return `
<figure class="mb-4 text-center">
  <a href="${originalUrl}" target="_blank" rel="noopener noreferrer">
    <img src="${smallUrl}" class="img-fluid rounded" alt="${caption || ''}">
  </a>
  ${caption ? `<figcaption class="mt-2 text-muted small">${caption}</figcaption>` : ''}
</figure>`;
}

/**
 * Responsive table
 */
function table(block: TableBlock): string {
	const { withHeadings, content } = block.data;

	if (!content || content.length === 0) {
		return '';
	}

	let tableHTML = '<div class="table-responsive"><table class="table table-bordered">';

	content.forEach((row: string[], rowIndex: number) => {
		const isHeader = withHeadings && rowIndex === 0;
		const tag = isHeader ? 'th' : 'td';

		if (isHeader) tableHTML += '<thead>';
		if (withHeadings && rowIndex === 1) tableHTML += '<tbody>';
		if (!withHeadings && rowIndex === 0) tableHTML += '<tbody>';

		tableHTML += '<tr>';
		row.forEach((cell: string) => {
			tableHTML += `<${tag}>${cell}</${tag}>`;
		});
		tableHTML += '</tr>';

		if (isHeader) tableHTML += '</thead>';
	});

	tableHTML += '</tbody></table></div>';
	return tableHTML;
}

/**
 * Raw HTML pass-through (trusted admin content)
 */
function raw(block: RawBlock): string {
	return block.data.html;
}

/**
 * Embed (YouTube, Vimeo, Codepen)
 * Responsive iframe with 16:9 aspect ratio using Bootstrap ratio classes
 */
function embed(block: EmbedBlock): string {
	const { service, embed: embedUrl, caption } = block.data;

	return `
<figure class="embed-container mb-4">
  <div class="ratio ratio-16x9">
    <iframe 
      src="${embedUrl}" 
      title="${service} embed"
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
  ${caption ? `<figcaption class="mt-2 text-muted small text-center">${caption}</figcaption>` : ''}
</figure>`;
}

// ============ Export Configured Parser ============

const plugins = {
	linkTool,
	image,
	table,
	raw,
	embed
};

export const edjsParser = edjsHTML(plugins);

/**
 * Parse EditorJS JSON data to HTML string
 * @param editorjsData - The EditorJS data object with blocks array
 * @returns HTML string or null if no content
 */
export function parseEditorJS(editorjsData: EditorJSData | null | undefined): string | null {
	if (!editorjsData?.blocks || editorjsData.blocks.length === 0) {
		return null;
	}

	// Cast to satisfy editorjs-html's OutputData type expectation
	const parsed = edjsParser.parse(editorjsData as Parameters<typeof edjsParser.parse>[0]);
	return Array.isArray(parsed) ? parsed.join('') : parsed;
}
