import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRunDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    run_category_id!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    vod_url!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    run_duration!: number;
}