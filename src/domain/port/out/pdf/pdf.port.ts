export interface PdfPort {
  createPdf(content: unknown) : Promise<unknown>
}
