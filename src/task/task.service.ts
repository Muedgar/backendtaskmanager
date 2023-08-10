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

  async findAll() {
    let allTasks = await this.findAllTasks();
    for(let i=0;i<allTasks.length;i++) {
      let task = allTasks[i]
      let newAssignees = []
      let newCollaborators = []

      for(let j=0;j<task.assignees.length;j++) {
        let assignee = task.assignees[j]
        const userFound = await this.userService.findOne(assignee)
        const fullname = userFound.first_name +" " +userFound.last_name
        newAssignees.push(fullname)
      }

      for(let j=0;j<task.collaborators.length;j++) {
        let collaborator = task.collaborators[j]
        const userFound = await this.userService.findOne(collaborator)
        const fullname = userFound.first_name +" " +userFound.last_name
        newCollaborators.push(fullname)
      }
      task.assignees = newAssignees
      task.collaborators = newCollaborators
    }
    
    return allTasks
  }

  async searchByName(name:string) {
        let task = await this.findTaskByName(name);
        if(!task) return await this.findAll()
      let newAssignees = []
      let newCollaborators = []

      for(let j=0;j<task.assignees.length;j++) {
        let assignee = task.assignees[j]
        const userFound = await this.userService.findOne(assignee)
        const fullname = userFound.first_name +" " +userFound.last_name
        newAssignees.push(fullname)
      }

      for(let j=0;j<task.collaborators.length;j++) {
        let collaborator = task.collaborators[j]
        const userFound = await this.userService.findOne(collaborator)
        const fullname = userFound.first_name +" " +userFound.last_name
        newCollaborators.push(fullname)
      }
      task.assignees = newAssignees
      task.collaborators = newCollaborators
      
    return [task]
    
  }

  async searchByDate(startDate:string,endDate:string) {
    let newStartDate = new Date(startDate)
    let newEndDate = new Date(endDate)
    if(newStartDate>=newEndDate) {
      return
    }
    
    let allTasks = await this.findAllTasks();

    for(let i=0;i<allTasks.length;i++) {
      let task = allTasks[i]
      let newAssignees = []
      let newCollaborators = []
    

      for(let j=0;j<task.assignees.length;j++) {
        let assignee = task.assignees[j]
        const userFound = await this.userService.findOne(assignee)
        const fullname = userFound.first_name +" " +userFound.last_name
        newAssignees.push(fullname)
      }

      for(let j=0;j<task.collaborators.length;j++) {
        let collaborator = task.collaborators[j]
        const userFound = await this.userService.findOne(collaborator)
        const fullname = userFound.first_name +" " +userFound.last_name
        newCollaborators.push(fullname)
      }
      task.assignees = newAssignees
      task.collaborators = newCollaborators
    }



    // start processing date
    let tasksInRange = []
    for(let i=0;i<allTasks.length;i++) {
      let task = allTasks[i]
      let duration = task.task_duration[0].split("&")
      let startDateTask = new Date(duration[0])
      let endDateTask = new Date(duration[1])
      console.log(startDate, endDate)
      if(newStartDate<=startDateTask && newStartDate<=endDateTask) {
        if(newEndDate>=startDateTask && newEndDate>=endDateTask) {
          tasksInRange.push(task)
        }
      }
    }
    if(tasksInRange.length>=1) {
      return tasksInRange
    }
    return
  }
  async findOne(id: string) {
    return await this.findTaskById(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return await this.updateTask(updateTaskDto, id)
  }

  async remove(id: string) {
    return await this.deleteTaskById(id);
  }

  private async createTask(createTaskDto: CreateTaskDto) {
    return await this.prismaService.task.create({
      data: {
        name: createTaskDto.name,
        task_duration: createTaskDto.task_duration,
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

    private async updateTask(updateTaskDto: UpdateTaskDto, id:string) {
    return await this.prismaService.task.update({
      where: {
        id: id
      },
      data: {
        name: updateTaskDto.name,
        task_duration: updateTaskDto.task_duration,
        assignees: updateTaskDto.assignees,
        collaborators: updateTaskDto.collaborators,
        projectId: updateTaskDto.project_id,
        description: updateTaskDto.description,
        priority: updateTaskDto.priority,
        attached: updateTaskDto.attached
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

  private async findAllTasks() {
  return await this.prismaService.task.findMany({
      where: {},
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

  private async findTaskById(id: string) {
  return await this.prismaService.task.findUnique({
      where: {
        id: id
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

  private async deleteTaskById(id: string) {
  return await this.prismaService.task.delete({
      where: {
        id: id
      },
      select: {
        id: true,
        name: true
      }
    })
  }
}
