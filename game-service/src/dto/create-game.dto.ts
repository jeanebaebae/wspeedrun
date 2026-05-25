import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty()
    @IsNotEmpty({ message: 'Game name must be filled' })
    @IsString()
    game_name!: string;

  @ApiProperty()
    @IsNotEmpty({ message: 'Game description must be filled' })
    @IsString()
    description!: string;
}