// Single source of truth for all Camp Paradise marketing copy + media.
// Copy pulled from the live site (camp-paradise.org). Leadership names/titles
// are placeholders marked TODO until the client supplies real values.

export interface NavItem {
	label: string;
	href: string;
}

export interface Facility {
	slug: string;
	name: string;
	blurb: string;
	image: string; // media slug (see static/media/<slug>-<w>w.<ext>)
	capacity?: string;
}

export interface Activity {
	name: string;
	icon: string; // bootstrap-icons-free name (rendered as inline svg elsewhere) or emoji fallback
}

export interface Review {
	quote: string;
	author: string;
	source: string;
}

export interface Leader {
	slug: string;
	name: string; // TODO: confirm real names
	title: string; // TODO: confirm real titles
	image: string;
}

export interface Stat {
	value: number;
	suffix: string;
	label: string;
}

export const site = {
	name: 'Camp Paradise',
	tagline: 'See, Know, and Experience God',
	description: 'A year-round Christian camp and retreat center in Strawberry Valley, California.',
	email: 'Contact@camp-paradise.org',
	address: {
		line1: '12725 La Porte Rd',
		city: 'Strawberry Valley',
		state: 'CA',
		zip: '95981',
		full: '12725 La Porte Rd, Strawberry Valley, CA 95981'
	},
	mapsEmbed: 'https://www.google.com/maps/embed/v1/place?key=&q=Camp+Paradise+Strawberry+Valley+CA',
	mapsLink: 'https://www.google.com/maps/place/12725+La+Porte+Rd,+Strawberry+Valley,+CA+95981',
	social: {
		facebook: 'https://www.facebook.com/pages/Camp-Paradise/1636950613259373',
		instagram: 'https://instagram.com/camp_paradise',
		youtube: 'https://www.youtube.com/channel/UCidjYEP3aP_tEPtxyaBnWCA',
		video: 'https://youtu.be/XupSgY8heYU'
	},
	googleReviews: 'https://www.google.com/maps/place/12725+La+Porte+Rd,+Strawberry+Valley,+CA+95981',
	distances: 'Located just 1.5 hours from Sacramento and 1.25 hours from Chico.'
} as const;

export const nav: NavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Mission', href: '/mission' },
	{ label: 'Facilities', href: '/facilities' },
	{ label: 'Gallery', href: '/gallery' },
	{ label: 'Location', href: '/location' },
	{ label: 'Donate', href: '/donate' }
];

export const home = {
	heroHeadline: 'See, Know, and Experience God',
	heroSub: 'Camp Paradise is a year-round camp and retreat center in Strawberry Valley, CA.',
	intro:
		'Come see why thousands of guests retreat to our mountain location each year for life-transforming ministry and life-long memories.',
	purpose:
		'Camp Paradise Christian Retreat exists to help people encounter God, grow in their faith, and build life-long memories in the beauty of the mountains.',
	ctaHeadline: 'What are you waiting for?',
	ctaSub: 'Book your stay and experience the mountains for yourself.'
};

export const stats: Stat[] = [
	{ value: 300, suffix: '+', label: 'Seats in the chapel' },
	{ value: 130, suffix: '', label: 'Seated in the dining hall' },
	{ value: 7, suffix: '', label: 'Cabins in the pines' },
	{ value: 16, suffix: '', label: 'RV slots with full hookups' }
];

export const facilities: Facility[] = [
	{
		slug: 'lodging',
		name: 'Lodges',
		blurb:
			'Three spacious lodge buildings, our main lodge plus two more, with room for large groups and restrooms and showers on site.',
		image: 'lodging',
		capacity: '~Sleeps 210'
	},
	{
		slug: 'cabins',
		name: 'Cabins',
		blurb:
			'Seven cabins nestled in the pines, each sleeping about 12, with a standalone restroom and shower building nearby.',
		image: 'cabins',
		capacity: '~Sleeps 84'
	},
	{
		slug: 'rv',
		name: 'RV Parking',
		blurb: 'Fifteen RV slots with full hookups for guests who bring their home on wheels.',
		image: 'lodging',
		capacity: 'Space for 15 RVs'
	},
	{
		slug: 'tents',
		name: 'Tent Camping',
		blurb: 'Pitch a tent almost anywhere on the property and sleep under the mountain stars.',
		image: 'gallery-08'
	},
	{
		slug: 'dining',
		name: 'Dining Hall & Kitchen',
		blurb:
			'Seats about 130 indoors plus an outdoor deck, served by a full commercial kitchen with private staff quarters.',
		image: 'kitchen',
		capacity: '~130 seated'
	},
	{
		slug: 'chapel',
		name: 'Chapel / Gym',
		blurb:
			'A gathering space for 300+ people that converts into a gymnasium, complete with ping-pong and indoor games.',
		image: 'chapel',
		capacity: '300+ people'
	},
	{
		slug: 'pool',
		name: 'Swimming Pool',
		blurb:
			'A full outdoor swimming pool perfect for recreation, cooling off on a summer day, or an impromptu splash.',
		image: 'drone'
	},
	{
		slug: 'sauna',
		name: 'Sauna',
		blurb:
			'A wood-burning dry sauna with showers and a tea resting room — the perfect way to unwind.',
		image: 'sauna'
	}
];

export const activities: Activity[] = [
	{ name: 'Basketball', icon: 'dribbble' },
	{ name: 'Volleyball', icon: 'circle' },
	{ name: 'Swimming Pool', icon: 'water' },
	{ name: 'Sauna', icon: 'thermometer-half' },
	{ name: 'Hiking', icon: 'signpost-split' },
	{ name: 'Frisbee Golf', icon: 'disc' },
	{ name: 'Horseshoe Pitching', icon: 'magnet' },
	{ name: 'Tether Ball', icon: 'bullseye' },
	{ name: 'Pull-up Bars', icon: 'grip-horizontal' },
	{ name: "Kid's Playground", icon: 'balloon' },
	{ name: 'Field Activities', icon: 'flag' }
];

export const activitiesNote = 'Plus much more to come!';

export const reviews: Review[] = [
	{ quote: 'Great place for a camping!', author: 'Andrei Duscov', source: 'Google' },
	{
		quote: 'I loved going as a kid, now sending my son.',
		author: 'Bryan Karavan',
		source: 'Google'
	},
	{ quote: 'Best camp for the money.', author: 'Cheri George', source: 'Google' },
	{
		quote:
			"This camp doesn't compare to any other. Best campground I've ever been to. Snows in the winter and it is beautiful!",
		author: 'Jason Crump',
		source: 'Google'
	},
	{
		quote:
			'We spend two weeks at the end of summer at Camp Paradise with the CFMS Earth Science Seminars. It is a wonderful place, the facilities are lovely.',
		author: 'Lazar Suprun',
		source: 'Google'
	}
];

export const mission = {
	mission:
		'Our mission at Camp Paradise is to provide a unique retreat environment with quality facilities where guests can retreat in comfort and security and where everyone is challenged to grow in their faith and relationship with Jesus Christ. We exist to evangelize and minister to children and youth in California for Jesus Christ through Christian camping.',
	vision:
		'Our vision is to EMPOWER people in their walk with Jesus, EQUIP them to share their Christian faith, and ENCOURAGE everyone who visits to live out the Gospel every day.',
	statementOfFaith:
		'We believe in God the Father, the Son, and the Holy Spirit — one God eternally existing in three persons. We believe in the deity of Jesus Christ, in salvation through faith in Him, and in the authority of the Scriptures.'
};

export const leaders: Leader[] = [
	{ slug: 'leader-ben', name: 'Benjamin Baljic', title: 'Camp President', image: 'leader-ben' },
	{ slug: 'leader-tim', name: 'Tim Vasko', title: 'Financial Officer', image: 'leader-tim' }
];

export const gallery: string[] = Array.from(
	{ length: 18 },
	(_, i) => `gallery-${String(i + 1).padStart(2, '0')}`
);

export const donate = {
	intro:
		'If you have the desire to support our mission, please donate using the options below. Even the smallest donations go a long way in helping us serve our guests. God bless you for your generosity!'
};

export const contact = {
	intro: "If you'd like to book a stay with us, don't hesitate to reach out!",
	email: 'Contact@camp-paradise.org',
	emailHref: 'mailto:Contact@camp-paradise.org',
	hours: 'Open year-round',
	hoursDetail: 'Retreat bookings available 7 days a week',
	responseTime: 'We typically respond within 1–2 business days.',
	fields: ['Full Name', 'Group Name', 'Contact Email', 'Telephone Number', 'Additional Information']
};

export const bratstvo = {
	portalUrl: 'https://app.camp-paradise.org/',
	hint: 'From Bratstvo youth? Registration is here'
};
