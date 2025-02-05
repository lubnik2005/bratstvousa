// Please, never have a helpers file
//
export function formatDate(dateString: string | null) {
	if (!dateString) return null;
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}

