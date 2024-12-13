export function databaseTableToReadableName(table: string): string {
	return table
		.split('_')
		.map(
			(part) =>
				part.charAt(0).toUpperCase() +
				part.slice(
					1,

					part.endsWith('s') ? -1 : part.length,
				),
		)
		.join(' ');
}
