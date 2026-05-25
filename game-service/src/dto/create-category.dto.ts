import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
    @IsNotEmpty({ message: 'Game ID must be filled' })
    @IsUUID()
    game_id!: string;

  @ApiProperty()
    @IsNotEmpty({ message: 'Run category name must be filled' })
    @IsString()
    run_category_name!: string;
}