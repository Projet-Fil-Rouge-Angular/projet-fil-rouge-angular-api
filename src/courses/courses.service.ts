import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Course } from "./entities/course.entity";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class CoursesService {
  private readonly dataFilePath = path.join(__dirname, "./", "../../data.json");

  private loadCourses(): Course[] {
    const data = fs.readFileSync(this.dataFilePath, "utf8");
    return JSON.parse(data);
  }

  private saveCourses(courses: Course[]): void {
    fs.writeFileSync(
      this.dataFilePath,
      JSON.stringify(courses, null, 2),
      "utf8"
    );
  }

  findAll(): Course[] {
    return this.loadCourses();
  }

  findOne(id: number): Course {
    const courses = this.loadCourses();
    const course = courses.find((course) => course.id === id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  create(course: Course): Course {
    const requiredFields = [
      "name",
      "description",
      "duration",
      "contentMarkdown",
      "imageUrl",
      "level",
      "prerequisites",
      "tags",
      "price"
    ];
    for (const field of requiredFields) {
      if (
        !course[field] ||
        (Array.isArray(course[field]) && course[field].length === 0)
      ) {
        throw new BadRequestException(
          `Field "${field}" is required and cannot be empty.`
        );
      }
    }

    const courses = this.loadCourses();
    course.id = courses.length > 0 ? courses[courses.length - 1].id + 1 : 1;
    courses.push(course);
    this.saveCourses(courses);
    return course;
  }

  update(id: number, updateData: Partial<Course>): Course {
    const courses = this.loadCourses();
    const course = courses.find((course) => course.id === id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    Object.assign(course, updateData);
    this.saveCourses(courses);
    return course;
  }

  remove(id: number): void {
    const courses = this.loadCourses();
    const index = courses.findIndex((course) => course.id === id);
    if (index === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    courses.splice(index, 1);
    this.saveCourses(courses);
  }
}
