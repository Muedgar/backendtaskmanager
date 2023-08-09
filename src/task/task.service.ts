import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserService } from 'src/user/user.service';
import { ProjectService } from 'src/project/project.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class TaskService {
  constructor(private userService: UserService, 
    private projectService: ProjectService,
    private prismaService: PrismaService) {}
  
  async create(createTaskDto: CreateTaskDto) {
    // verify if assignees or collaborators are users in the system
    for(let i=0;i<createTaskDto.assignees.length;i++) {
      const assignee = await this.userService.findOne(createTaskDto.assignees[i])
      if(!assignee) throw new ForbiddenException("Some assignees are not users in the system")
    }
    for(let i=0;i<createTaskDto.collaborators.length;i++) {
      const collaborator = await this.userService.findOne(createTaskDto.collaborators[i])
      if(!collaborator) throw new ForbiddenException("Some collaborators are not users in the system")
    }
    // verify if project exists
    const project = this.projectService.findOne(createTaskDto.project_id)
    if(!project) throw new ForbiddenException("Project was not found")
    
    // verify if task already exists
    const task = await this.findTaskByName(createTaskDto.name)
   
    if(task) throw new ForbiddenException("Task with this name already exists, choose another name.")

    // create task.
    return await this.createTask(createTaskDto);
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: string) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  private async createTask(createTaskDto: CreateTaskDto) {
    return await this.prismaService.task.create({
      data: {
        name: createTaskDto.name,
        task_duration: [`${createTaskDto.start_date}&${createTaskDto.end_date}`],
        assignees: createTaskDto.assignees,
        collaborators: createTaskDto.collaborators,
        projectId: createTaskDto.project_id,
        description: createTaskDto.description,
        priority: createTaskDto.priority,
        attached: createTaskDto.attached
      },
      select: {
        id: true,
        name: true,
        task_duration: true,
        assignees: true,
        collaborators: true,
        project_id: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        description: true,
        priority: true,
        attached: true
      }
    })
  }

  private async findTaskByName(name: string) {
  return await this.prismaService.task.findUnique({
      where: {
        name: name
      },
      select: {
        id: true,
        name: true
      }
    })
  }
}
