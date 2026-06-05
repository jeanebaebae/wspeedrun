import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: '4f319613-0c07-4594-bb31-4bbba686dd26',
    description: 'Game ID from Game Service',
  })
  @IsString()
  @IsNotEmpty()
  game_id: string;

  @ApiProperty({
    example: 'Any%',
    description: 'Run category name',
  })
  @IsString()
  @IsNotEmpty()
  run_category_name: string;
}