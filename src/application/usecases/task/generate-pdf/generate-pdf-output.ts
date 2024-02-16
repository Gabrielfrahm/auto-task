import { Either } from "@shared/either";

export type GeneratePdfOutput = Either<Error, ArrayBuffer>;
