import type { PageServerLoad } from './$types';
import { type Actions, error } from '@sveltejs/kit';
import db from '$lib/server/mongodb';
import type { SubjectsContent } from '$lib/types/subjects';

export const actions: Actions = {
	addSubject: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const description = data.get('description')?.toString().trim() || '';
		const numSections = data.get('sections')?.toString().trim();

		const session = locals.session;
		if (!session || !locals.user) {
			throw error(403, 'Forbidden');
		}

		if (!name || !numSections) {
			throw error(400, 'Subject name and sections are required');
		}

		const numSectionsParsed = parseInt(numSections, 10);

		if (Number.isNaN(numSectionsParsed) || numSectionsParsed > 4 || numSectionsParsed < 1) {
			throw error(403, 'Subject Sections should be between 1 to 4 and not NaN');
		}

		await db.collection<SubjectsContent>('subjects').insertOne({
			userId: session.userId,
			name,
			description,
			numSections: parseInt(numSections, 10),
			createdAt: new Date()
		});
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	return {
		session: locals.session,
		user: locals.user
	};
};
