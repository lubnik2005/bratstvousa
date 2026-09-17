/**
 * Server-side validation + normalisation for the legacy Camp Paradise
 * "Health Form" (form id 2). Mirrors the Yup rules of the original React
 * console so stored answers stay compatible with the 2,149 legacy rows:
 * all values are strings ('true' / 'false'), empty -> null.
 */

export const HEALTH_FORM_ID = 2;

export const HEALTH_FORM_KEYS = [
	'isMinor',
	'hasMedicalProblems',
	'medicalProblems',
	'immunizations',
	'hasAllergies',
	'allergies',
	'hasMedicines',
	'medicineDose',
	'medicineFrequency',
	'medicineAbility',
	'minorFullName',
	'guardianFullName',
	'guardianPhone'
] as const;

export type HealthFormKey = (typeof HEALTH_FORM_KEYS)[number];
export type HealthFormAnswers = Record<HealthFormKey, string | null> & { agreed: true };

export function isHealthForm(form: { id: number; name: string }): boolean {
	return form.id === HEALTH_FORM_ID || form.name === 'Health Form';
}

const clean = (v: FormDataEntryValue | null): string => (typeof v === 'string' ? v.trim() : '');
const orNull = (v: string): string | null => (v === '' ? null : v);

export function parseHealthForm(
	fd: FormData,
	formId: number
): { answers: HealthFormAnswers; errors: Record<string, string> } {
	const get = (key: HealthFormKey) => clean(fd.get(`form_${formId}_${key}`));
	const errors: Record<string, string> = {};
	const err = (key: HealthFormKey, msg: string) => {
		errors[`form_${formId}_${key}`] = msg;
	};

	const raw: Record<HealthFormKey, string> = {
		isMinor: get('isMinor'),
		hasMedicalProblems: get('hasMedicalProblems'),
		medicalProblems: get('medicalProblems'),
		immunizations: get('immunizations'),
		hasAllergies: get('hasAllergies'),
		allergies: get('allergies'),
		hasMedicines: get('hasMedicines'),
		medicineDose: get('medicineDose'),
		medicineFrequency: get('medicineFrequency'),
		medicineAbility: get('medicineAbility'),
		minorFullName: get('minorFullName'),
		guardianFullName: get('guardianFullName'),
		guardianPhone: get('guardianPhone')
	};

	if (raw.isMinor !== 'true' && raw.isMinor !== 'false') err('isMinor', 'Age is required');

	const minor = raw.isMinor === 'true';

	if (minor) {
		if (raw.hasMedicalProblems !== 'true' && raw.hasMedicalProblems !== 'false')
			err('hasMedicalProblems', 'Please select if any medical problems');
		if (raw.hasMedicalProblems === 'true' && !raw.medicalProblems)
			err('medicalProblems', 'Please provide a comma separated list of medical problems');

		if (!['none', 'up-to-date', 'tetanus'].includes(raw.immunizations))
			err('immunizations', 'Please select if any immunizations');

		if (raw.hasAllergies !== 'true' && raw.hasAllergies !== 'false')
			err('hasAllergies', 'Please select if any allergies');
		if (raw.hasAllergies === 'true' && !raw.allergies)
			err('allergies', 'Please provide a comma separated list of allergies');

		if (raw.hasMedicines !== 'true' && raw.hasMedicines !== 'false')
			err('hasMedicines', 'Please select if any medicines');
		if (raw.hasMedicines === 'true') {
			if (!raw.medicineDose) err('medicineDose', 'Please provide a the dose of the medication');
			if (!raw.medicineFrequency)
				err('medicineFrequency', 'Please provide a how often the medicines should be taken');
			if (raw.medicineAbility !== 'true' && raw.medicineAbility !== 'false')
				err('medicineAbility', 'Please provide if the minor can take it on his/her own');
		}

		if (!raw.minorFullName) err('minorFullName', "Please provide the minor's full name");
		if (!raw.guardianFullName) err('guardianFullName', "Please provide the guardian's full name");
		if (!raw.guardianPhone) err('guardianPhone', "Please provide the guardian's phone number");
	} else {
		// Adults answer no medical questions (legacy behaviour): drop any stray values.
		for (const k of HEALTH_FORM_KEYS) if (k !== 'isMinor') raw[k] = '';
		if (raw.hasMedicalProblems !== 'true') raw.medicalProblems = '';
	}

	// Dependent fields are cleared when their parent is "no".
	if (raw.hasMedicalProblems !== 'true') raw.medicalProblems = '';
	if (raw.hasAllergies !== 'true') raw.allergies = '';
	if (raw.hasMedicines !== 'true') {
		raw.medicineDose = '';
		raw.medicineFrequency = '';
		raw.medicineAbility = '';
	}

	const answers = Object.fromEntries(HEALTH_FORM_KEYS.map((k) => [k, orNull(raw[k])])) as Record<
		HealthFormKey,
		string | null
	>;

	return { answers: { ...answers, agreed: true }, errors };
}
