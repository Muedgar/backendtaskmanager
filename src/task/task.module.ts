import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [UserModule, ProjectModule],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
