import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoursesModule, AuthModule],
})
export class AppModule {}
