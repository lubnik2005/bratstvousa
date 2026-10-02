// Clickable areas on the camp map (static/map.webp, 3456x2592).
// Coordinates are percentages of the map image so they scale with any size.

export const MAP_IMAGE = {
	src: '/map.webp',
	width: 3456,
	height: 2592
} as const;

export type MapHotspot = {
	id: string;
	name: string;
	description: string;
	/** Box on the map, in % of the map image. */
	box: { left: number; top: number; width: number; height: number };
	floorPlan: { src: string; pdf: string; width: number; height: number };
};

export const MAP_HOTSPOTS: MapHotspot[] = [
	{
		id: 'lodge-1',
		name: 'Lodge 1',
		description: 'Rooms 101–116, restrooms, and the nurse station.',
		box: { left: 67.9, top: 47.3, width: 8.6, height: 4.3 },
		floorPlan: {
			src: '/lodges/lodge-1.webp',
			pdf: '/lodges/lodge-1.pdf',
			width: 4038,
			height: 1596
		}
	},
	{
		id: 'lodge-2',
		name: 'Lodge 2',
		description: 'Lodge rooms with restrooms, next to the dining hall.',
		box: { left: 63, top: 89.85, width: 10.85, height: 2.95 },
		floorPlan: {
			src: '/lodges/lodge-2.webp',
			pdf: '/lodges/lodge-2.pdf',
			width: 4023,
			height: 1223
		}
	},
	{
		id: 'lodge-3',
		name: 'Lodge 3',
		description: 'Lodge rooms with restrooms, next to the dining hall.',
		box: { left: 63, top: 92.95, width: 10.85, height: 2.85 },
		floorPlan: {
			src: '/lodges/lodge-3.webp',
			pdf: '/lodges/lodge-3.pdf',
			width: 4023,
			height: 1263
		}
	}
];
