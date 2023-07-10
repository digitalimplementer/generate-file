import { IsString, IsNumber } from 'class-validator';

export class QueryDto {
  @IsNumber()
  id: number;

  @IsString()
  keyword: string;

  @IsString()
  type: string;

  @IsString()
  mode: string;

  @IsNumber()
  limit: number;

  @IsNumber()
  offset: number;
}
