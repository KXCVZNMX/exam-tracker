import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import db from '$lib/server/mongodb';
import type { Comments, Exam, SubjectsContent } from '$lib/types/subjects';
import { ObjectId } from 'mongodb';

type CommentsWithName = {
	examId: string;
	company: string;
	year: number;
	comments: Comments[];
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = locals.session;
	if (!session || !locals.user) {
		throw error(403, 'Forbidden');
	}

	let subjectName;
	let subjectContent;
	try {
		subjectName = await db.collection<SubjectsContent>('subjects').findOne(
			{
				_id: new ObjectId(params.subjectId),
				userId: session.userId,
			},
			{
				projection: {
					name: 1
				}
			}
		);

		subjectContent = await db.collection<Exam>('exams').find(
			{
				subjectId: params.subjectId,
				userId: session.userId,
			},
			{
				projection: {
					_id: 1,
					company: 1,
					year: 1,
					comments: 1
				}
			}
		).toArray();
	} catch {
		throw error(400, 'Invalid subject ID');
	}

	const subjectComments: CommentsWithName[] = subjectContent
		.map((exam) => ({
			examId: exam._id.toString(),
			company: exam.company,
			year: exam.year,
			comments: exam.comments,
		}));

	if (!subjectName) {
		throw error(404, 'Subject Not Found');
	}

	return {
		subjectName: subjectName.name,
		subjectComments,
	};
}