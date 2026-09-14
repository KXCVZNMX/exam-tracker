import type { PageServerLoad } from './$types';
import db from '$lib/server/mongodb';
import type { Exam, SubjectsContent } from '$lib/types/subjects';
import { type Actions, error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const actions: Actions = {
	addExam: async ({ request, locals, params }) => {
		const session = locals.session;
		if (!session || !locals.user) throw error(403, 'Forbidden');
		const subjectId = params.subjectId;
		if (!subjectId) throw error(400, 'Subject id is required');

		const data = await request.formData();
		const company = data.get('company')?.toString().trim();
		const year = Number(data.get('year'));
		const sectionCount = Number(data.get('sections'));
		const completed = data.get('completed') === 'on';
		const comment = data.get('comment')?.toString() ?? '';

		if (
			!company ||
			!Number.isInteger(year) ||
			!Number.isInteger(sectionCount) ||
			sectionCount < 1
		) {
			throw error(400, 'Invalid exam details');
		}

		const sections: Exam['sections'] = [];
		for (let i = 0; i < sectionCount; i += 1) {
			const sectionScore = Number(data.get(`mark_${i}`));
			const sectionFullScore = Number(data.get(`totalMark_${i}`));
			if (
				!Number.isFinite(sectionScore) ||
				!Number.isFinite(sectionFullScore) ||
				sectionScore < 0 ||
				sectionFullScore < 1
			) {
				throw error(400, 'Invalid section marks');
			}
			sections.push({ sectionNum: i + 1, sectionScore, sectionFullScore });
		}

		try {
			const subject = await db.collection<SubjectsContent>('subjects').findOne({
				_id: new ObjectId(subjectId),
				userId: session.userId
			});
			if (!subject) throw error(404, 'Subject not found');

			await db.collection<Exam>('exams').insertOne({
				company,
				year,
				completed,
				sections,
				comments: comment ? [comment] : [],
				subjectId,
				userId: session.userId
			});
		} catch (cause) {
			if (cause && typeof cause === 'object' && 'status' in cause) throw cause;
			throw error(400, 'Invalid subject id');
		}
	}
};

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = locals.session;
	if (!session || !locals.user) {
		throw error(403, 'Forbidden');
	}

	let subjectExams;
	let subject;
	try {
		subject = await db.collection<SubjectsContent>('subjects').findOne({
			_id: new ObjectId(params.subjectId),
			userId: session.userId
		});
		subjectExams = await db.collection<Exam>('exams').find({
			subjectId: params.subjectId,
			userId: session.userId
		}).toArray();
	} catch {
		throw error(400, 'Invalid subject id');
	}

	if (!subject) {
		throw error(404, 'Subject not found');
	}

	return {
		subject: { ...subject, _id: subject._id.toString() },

		subjectExams: subjectExams.map((exam) => ({
			...exam,
			_id: exam._id.toString()
		}))
	};
};
