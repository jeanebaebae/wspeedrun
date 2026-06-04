import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGameDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  game_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}