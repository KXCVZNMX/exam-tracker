import type {PageServerLoad} from './$types'
import db from '$lib/server/mongodb';
import type { SubjectExams, SubjectsContent } from '$lib/types/subjects';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

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
			userId: session.userId,
		});
		subjectExams = await db.collection<SubjectExams>('subject-exams').findOne({
			subjectId: params.subjectId,
			userId: session.userId
		});
	} catch {
		throw error(400, 'Invalid subject id');
	}

	if (!subject) {
		throw error(404, 'Subject not found');
	}

	return {
		subject: { ...subject, _id: subject._id.toString() },

		subjectExams: subjectExams ? { ...subjectExams, _id: subjectExams._id.toString() } : null
	};
}