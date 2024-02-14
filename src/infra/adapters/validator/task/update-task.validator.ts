import { Transform } from "class-transformer";
import { IsDate,  IsOptional, IsString,  } from "class-validator";

export class UpdateTaskValidator {

  @IsString()
  @IsOptional()
	public name?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  public start_date?: Date;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  public finish_date?: Date;
}
