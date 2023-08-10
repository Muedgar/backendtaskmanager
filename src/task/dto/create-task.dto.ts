import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsArray()
    task_duration: string[];

    @IsNotEmpty()
    @IsArray()
    assignees: string[];

    @IsOptional()
    @IsArray()
    collaborators: string[];

    @IsNotEmpty()
    @IsString()
    project_id: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    priority: string;

    @IsOptional()
    @IsArray()
    attached?: string[];
}
