import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    email:string
    
    @IsNotEmpty()
    @IsString()
    first_name: string
    
    @IsNotEmpty()
    @IsString()
    last_name: string
}
