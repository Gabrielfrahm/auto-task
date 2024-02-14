import { IsDate, IsNotEmpty, IsOptional, IsString, } from "class-validator";
import {Transform} from "class-transformer";

export class CreateTaskValidator {

  @IsString()
  @IsNotEmpty()
	public name: string;

  @IsString()
  @IsNotEmpty()
  public description : string;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsOptional()
  public start_date?: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsOptional()
  public finish_date?: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsOptional()
  public created_at?: Date;
}

