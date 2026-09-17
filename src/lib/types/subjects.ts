export interface SubjectsContent {
	userId: string;
	name: string;
	description?: string;
	numSections: number;
	createdAt: Date;
}

export interface Exam {
	userId: string;
	subjectId: string;
	company: string;
	year: number;
	dateCompleted: Date | null;
	sections: {
		sectionNum: number;
		sectionScore: number;
		sectionFullScore: number;
	}[];
	comments: Comments[];
}

export interface Comments {
	id: string;
	title: string;
	updated: Date;
	content: string;
}
