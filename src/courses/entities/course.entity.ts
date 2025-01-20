export class Course {
    id: number;
    name: string;
    description: string;
    duration: number;
    durationUnit: string;
    contentMarkdown: string;
    imageUrl: string;
    level: string;
    prerequisites: string[];
    tags: string[];
}
