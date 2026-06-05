import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: '4f319613-0c07-4594-bb31-4bbba686dd26',
    description: 'Game ID from Game Service',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  game_id?: string;

  @ApiPropertyOptional({
    example: '100%',
    description: 'Updated run category name',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  run_category_name?: string;
}