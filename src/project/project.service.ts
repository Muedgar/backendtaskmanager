import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}
  async create(createProjectDto: CreateProjectDto) {
    return await this.createProject(createProjectDto)
  }

  async findAll() {
    return await this.findAllProjects();
  }

  async findOne(id: string) {
    return await this.findProjectById(id)
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

    private async findProjectById(id: string) {
            return await this.prismaService.project.findUnique({
            where: {
                id: id
            },
            select: {
                        id: true,
                        name: true,
                        description: true
            }
        });
  }
      private async findAllProjects() {
            return await this.prismaService.project.findMany({
            where: {},
            select: {
                        id: true,
                        name: true,
                        description: true
            }
        });
  }

      private async createProject(createProjectDto: CreateProjectDto) {
            return await this.prismaService.project.create({
            data: {
                name: createProjectDto.name,
                description: createProjectDto.description
            },
            select: {
                        id: true,
                        name: true,
                        description: true
            }
        });
  }
}
