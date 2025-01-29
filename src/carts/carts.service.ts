import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { Cart, CartCourse } from "./entities/cart.entity";
import { Course } from "../courses/entities/course.entity";

@Injectable()
export class CartsService {
  private readonly cartsFilePath = path.join(__dirname, "../../carts.json");
  private readonly coursesFilePath = path.join(__dirname, "../../data.json");

  private loadCarts(): Cart[] {
    if (!fs.existsSync(this.cartsFilePath)) return [];
    return JSON.parse(fs.readFileSync(this.cartsFilePath, "utf8"));
  }

  private saveCarts(carts: Cart[]): void {
    fs.writeFileSync(this.cartsFilePath, JSON.stringify(carts, null, 2), "utf8");
  }

  private loadCourses(): Course[] {
    if (!fs.existsSync(this.coursesFilePath)) return [];
    return JSON.parse(fs.readFileSync(this.coursesFilePath, "utf8"));
  }

  private findOrCreateCart(userId: number): Cart {
    let carts = this.loadCarts();
    let cart = carts.find((c) => c.userId === userId);

    if (!cart) {
      cart = { id: carts.length + 1, userId, courses: [] };
      carts.push(cart);
      this.saveCarts(carts);
    }

    return cart;
  }

  private isScheduleConflict(courseId: number, schedule: string, duration: number): boolean {
    const carts = this.loadCarts();
    const newStartTime = new Date(schedule).getTime();
    const newEndTime = newStartTime + duration * 60000;

    return carts.some((cart) =>
      cart.courses.some((cc) => {
        if (cc.courseId !== courseId) return false;

        const existingStartTime = new Date(cc.schedule).getTime();
        const existingEndTime = existingStartTime + duration * 60000;

        return (
          (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
          (existingStartTime >= newStartTime && existingStartTime < newEndTime)
        );
      })
    );
}

  addCourseToCart(userId: number, courseId: number, schedule: string): Cart {
    let carts = this.loadCarts();
    let cart = this.findOrCreateCart(userId);
    const courses = this.loadCourses();

    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    console.log(course.duration);
    if (this.isScheduleConflict(courseId, schedule, course.duration)) {
      throw new BadRequestException(`Schedule conflict: This course is already booked.`);
    }
    cart.courses.push({ courseId, schedule });

    carts = carts.map((c) => (c.userId === userId ? cart : c));
    this.saveCarts(carts);

    return cart;
  }

  removeCourseFromCart(userId: number, courseId: number): Cart {
    let carts = this.loadCarts();
    let cart = this.findOrCreateCart(userId);

    cart.courses = cart.courses.filter((cc) => cc.courseId !== courseId);

    carts = carts.map((c) => (c.userId === userId ? cart : c));
    this.saveCarts(carts);

    return cart;
  }

  findUserCart(userId: number): Cart {
    return this.findOrCreateCart(userId);
  }
  
  clearCart(userId: number): Cart {
    let carts = this.loadCarts();
    let cart = carts.find(c => c.userId === userId);
  
    if (!cart) {
      throw new NotFoundException("Panier introuvable");
    }  
    cart.courses = [];
    this.saveCarts(carts);
  
    return cart;
  }
  
}
