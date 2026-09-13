import { error, type Actions, redirect } from '@sveltejs/kit';
import db from '$lib/server/mongodb';
import type { SubjectsContent } from '$lib/types/subjects';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/(main)/subjects/$types';
import { deleteSubject } from '$lib/server/actions/subjects';

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

		await db.collection<SubjectsContent>('subjects').insertOne({
			userId: session.userId,
			name,
			description,
			numSections: parseInt(numSections, 10),
			createdAt: new Date()
		});
	},
	...deleteSubject
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(302, '/auth');
	}

	const subjects = await db
		.collection<SubjectsContent>('subjects')
		.find({ userId: locals.session.userId })
		.sort({ createdAt: -1 })
		.toArray();

	return {
		subjects: subjects.map((s) => ({
			...s,
			_id: s._id.toString()
		}))
	};
};
