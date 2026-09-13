export interface SubjectsContent {
	userId: string;
	name: string;
	description?: string;
	numSections: number;
	createdAt: Date;
}

export interface SubjectExams {
	userId: string;
	subjectId: string;
	examName: string;
	exams: Exam[];
}

export interface Exam {
	company: string;
	year: number;
	completed: boolean;
	partAMark: number;
	partBMark: number;
	partAFullMark: number;
	partBFullMark: number;
	comments: string[];
}