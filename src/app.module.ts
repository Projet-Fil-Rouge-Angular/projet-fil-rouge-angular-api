import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [CoursesModule, AuthModule, CartsModule],
})
export class AppModule {}
