// Contact details shown only to signed-in campers. Lives under $lib/server so it
// can never be bundled into client JS; it reaches the browser only via layout
// data, and only when a valid session exists.
export const PRIVATE_CONTACT = {
	phone: '(916) 707-2355',
	phoneHref: 'tel:+19167072355'
} as const;
