import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CartsService } from "./carts.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("carts")
@UseGuards(AuthGuard("jwt"))
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getUserCart(@Request() req) {
    return this.cartsService.findUserCart(req.user.userId);
  }

  @Post("courses")
  addCourse(
    @Request() req,
    @Body("courseId") courseId: number,
    @Body("schedule") schedule: string
  ) {
    return this.cartsService.addCourseToCart(req.user.userId, courseId, schedule);
  }

  @Delete("courses/:courseId")
  removeCourse(@Request() req, @Param("courseId") courseId: number) {
    return this.cartsService.removeCourseFromCart(req.user.userId, Number(courseId));
  }

  @Delete("")
  clearCart(@Request() req) {
    return this.cartsService.clearCart(req.user.userId);
  }
}
