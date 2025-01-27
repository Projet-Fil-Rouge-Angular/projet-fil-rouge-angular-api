import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CoursesService } from "./courses.service";
import { Course } from "./entities/course.entity";
import { RolesGuard } from "src/shared/guards/roles.guard";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    const courses = this.coursesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: "Courses retrieved successfully",
      data: courses,
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    try {
      const course = this.coursesService.findOne(+id);
      return {
        statusCode: HttpStatus.OK,
        message: `Course with ID ${id} retrieved successfully`,
        data: course,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: error.message },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() course: Course) {
    const createdCourse = this.coursesService.create(course);
    return {
      statusCode: HttpStatus.CREATED,
      message: "Course created successfully",
      data: createdCourse,
    };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateData: Partial<Course>) {
    try {
      const updatedCourse = this.coursesService.update(+id, updateData);
      return {
        statusCode: HttpStatus.OK,
        message: `Course with ID ${id} updated successfully`,
        data: updatedCourse,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: error.message },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    try {
      this.coursesService.remove(+id);
      return {
        statusCode: HttpStatus.OK,
        message: `Course with ID ${id} deleted successfully`,
      };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: error.message },
        HttpStatus.NOT_FOUND
      );
    }
  }
}
