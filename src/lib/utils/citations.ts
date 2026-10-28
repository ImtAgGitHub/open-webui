export type CitationRef = { sourceIdx: number; docIdx: number };

export type CitationEntry = {
	key: string;
	name: string;
	url: string | null;
	refs: CitationRef[];
};

/**
 * Build the ordered list of citable sources the way the backend numbers them
 * (`get_source_context` in middleware.py): one number per unique
 * `metadata.source || source.id`, in order of first appearance. Entry `n - 1`
 * is the target of the inline marker `[n]`.
 */
export const buildCitationEntries = (sources: any[], citationsEnabled = true): CitationEntry[] => {
	const entries: CitationEntry[] = [];

	if (!citationsEnabled) {
		(sources ?? []).forEach((source, sourceIdx) => {
			(source?.document ?? []).forEach((_, docIdx) => {
				entries.push({ key: 'N/A', name: 'N/A', url: null, refs: [{ sourceIdx, docIdx }] });
			});
		});
		return entries;
	}

	const entryByKey = new Map<string, CitationEntry>();

	(sources ?? []).forEach((source, sourceIdx) => {
		const documents = source?.document ?? [];
		const metadatas = source?.metadata ?? [];
		const count = Math.min(documents.length, metadatas.length);

		for (let docIdx = 0; docIdx < count; docIdx++) {
			const metadata = metadatas[docIdx];
			const key = metadata?.source || source?.source?.id || 'N/A';
			const url = metadata?.url || null;

			const existing = entryByKey.get(key);
			if (existing) {
				existing.refs.push({ sourceIdx, docIdx });
				if (!existing.url && url) existing.url = url;
				continue;
			}

			let name: string;
			if (metadata?.name) {
				name = metadata.name;
			} else if (key.startsWith('http://') || key.startsWith('https://')) {
				name = key;
			} else {
				name = source?.source?.name ?? key;
			}

			const entry = { key, name, url, refs: [{ sourceIdx, docIdx }] };
			entryByKey.set(key, entry);
			entries.push(entry);
		}
	});

	return entries;
};

/** Open a citation link. Helix links (ttstudio://) stay in the current tab. */
export const openCitationUrl = (url: string) => {
	if (/^ttstudio:/i.test(url)) {
		window.location.href = url;
	} else {
		window.open(url, '_blank');
	}
};
