import { error, type Actions, redirect } from '@sveltejs/kit';
import db from '$lib/server/mongodb';
import type { SubjectsContent } from '$lib/types/subjects';
import type { PageServerLoad } from './$types';
import { deleteSubject } from '$lib/server/actions/subjects';
import { ObjectId } from 'mongodb';

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
			throw error(403, "Subject Sections should be between 1 to 4 and not NaN")
		}

		await db.collection<SubjectsContent>('subjects').insertOne({
			userId: session.userId,
			name,
			description,
			numSections: parseInt(numSections, 10),
			createdAt: new Date()
		});
	},
	editSubject: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const description = data.get('description')?.toString().trim() || '';
		const numSections = data.get('sections')?.toString().trim();
		const subjectId = data.get('subjectId')?.toString().trim();

		const session = locals.session;
		if (!session || !locals.user) {
			throw error(403, 'Forbidden');
		}

		if (!name || !numSections || !subjectId) {
			throw error(400, 'Subject name, subject Id and sections are required');
		}

		const numSectionsParsed = parseInt(numSections, 10);

		if (numSectionsParsed > 4 || numSectionsParsed < 1) {
			throw error(403, 'Sections num should be between 1 to 4');
		}

		await db.collection<SubjectsContent>('subjects').updateOne(
			{
				_id: new ObjectId(subjectId),
				userId: session.userId
			},
			{
				$set: {
					name,
					description,
					numSections: parseInt(numSections, 10)
				}
			}
		);
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
