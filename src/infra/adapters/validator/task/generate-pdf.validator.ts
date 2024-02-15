import { Transform } from "class-transformer";
import { IsDate,  IsNotEmpty } from "class-validator";

export class GeneratePdfValidator {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
	public date: Date;
}
