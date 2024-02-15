import { PdfPort } from "@domain/port/out/pdf/pdf.port";
import jsPDF from "jspdf";

export class JsPdfAdapter implements PdfPort {
	async createPdf(content: unknown): Promise<unknown> {
		const doc = new jsPDF();
		console.log(content);
		doc.text("test" , 10, 10);
		return doc.output("arraybuffer");
	}
}
