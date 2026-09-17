import type { PageServerLoad } from './$types';
import { type Actions, error } from '@sveltejs/kit';
import db from '$lib/server/mongodb';
import type { Comments, Exam, SubjectsContent } from '$lib/types/subjects';
import { ObjectId } from 'mongodb';

type CommentsWithName = {
	examId: string;
	company: string;
	year: number;
	comments: Comments[];
}

export const actions: Actions = {
	addComment: async ({ request, locals, params }) => {
		const session = locals.session;
		if (!session || !locals.user) throw error(403, 'Forbidden');
		const subjectId = params.subjectId;
		if (!subjectId) throw error(400, 'Subject id is required');

		const data = await request.formData();
		const examName = data.get('examName')?.toString().trim();
		const title = (data.get('title') ?? 'Untitled Comment').toString().trim();
		if (!examName) throw error(400, 'ExamId is required');

		const newComment: Comments = {
			id: (new ObjectId()).toString(),
			title,
			updated: new Date(),
			content: ''
		};

		try {
			await db.collection<Exam>('exams').updateOne(
				{
					_id: new ObjectId(examName),
					userId: session.userId,
					subjectId: subjectId,
				},
				{
					$push: {
						comments: newComment
					}
				}
			);
		} catch (cause) {
			if (cause && typeof cause === 'object' && 'status' in cause) throw cause;
			throw error(400, 'Invalid subject id');
		}
	},
	saveComment: async ({ request, locals, params }) => {
		const session = locals.session;
		if (!session || !locals.user) throw error(403, 'Forbidden');
		const subjectId = params.subjectId;
		if (!subjectId) throw error(400, 'Subject id is required');

		const data = await request.formData();
		const commentId = data.get('commentId')?.toString().trim();
		const content = data.get('content')?.toString().trim() ?? '';
		const examId = data.get('examId')?.toString().trim();

		if (!commentId) throw error(400, 'Comment id is required');
		if (!examId) throw error(400, 'Exam ID is required');

		try {
			const result = await db.collection<Exam>('exams').updateOne(
				{
					_id: new ObjectId(examId),
					subjectId,
					userId: session.userId,
					'comments.id': commentId
				},
				{
					$set: {
						'comments.$.content': content,
						'comments.$.updated': new Date()
					}
				}
			);
			if (result.matchedCount === 0) throw error(404, 'Comment not found');
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

	if (subjectComments.length === 0) {
		throw error(400, 'No Exams Found');
	}

	return {
		subjectName: subjectName.name,
		subjectComments,
	};
}