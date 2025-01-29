export class Course {
  id: number;
  name: string;
  description: string;
  duration: number;
  contentMarkdown: string;
  imageUrl: string;
  level: string;
  prerequisites: string[];
  tags: string[];
  price: number;
}
