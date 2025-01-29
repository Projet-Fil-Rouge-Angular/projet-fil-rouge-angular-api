export class Cart {
    id: number;
    userId: number;
    courses: CartCourse[];
  }
  
  export class CartCourse {
    courseId: number;
    schedule: string;
  }
  