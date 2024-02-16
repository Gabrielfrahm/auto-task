import { Either } from "@shared/either";

export interface PdfPort {
  createPdf(content: unknown) : Promise<Either<Error, ArrayBuffer>>
}
