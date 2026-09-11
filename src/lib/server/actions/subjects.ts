import { type Actions, error } from '@sveltejs/kit';
import db from '$lib/server/mongodb';
import type { SubjectsContent } from '$lib/types/subjects';
import { ObjectId } from 'mongodb';

export const deleteSubject: Actions = {
	deleteSubject: async ({ request, locals }) => {
		const data = await request.formData();
		const subjectId = data.get('id')?.toString().trim();

		const session = locals.session;
		if (!session || !locals.user) {
			throw error(403, 'Forbidden');
		}

		if (!subjectId) {
			throw error(400, 'Cannot delete subject without subjectID');
		}

		await db.collection<SubjectsContent>('subjects').deleteOne({
			_id: new ObjectId(subjectId),
			userId: session.userId
		});
	}
};
