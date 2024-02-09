import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskValidator {

  @IsString()
  @IsNotEmpty()
	public name: string;

  @IsString()
  @IsNotEmpty()
  public description : string;

  @IsDateString()
  @IsOptional()
  public start_date?: Date;

  @IsDateString()
  @IsOptional()
  public finish_date?: Date;

  @IsDateString()
  @IsOptional()
  public created_at?: Date;
}

