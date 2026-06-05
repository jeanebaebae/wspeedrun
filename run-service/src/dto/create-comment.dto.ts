import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    run_id!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    user_id!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    comment!: string;
}