import { PdfPort } from "@domain/port/out/pdf/pdf.port";
import { Either, left, right } from "@shared/either";
import { InfraException } from "@shared/errors/infra.error";
import { format } from "date-fns";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export class JsPdfAdapter implements PdfPort {
	async createPdf(content: {
    id: string;
    name: string;
    description: string;
    data: string;
    initial_hour: string;
    finished_hour?: string;
  }[] ): Promise<Either<Error, ArrayBuffer>> {
		try{
			console.log("content", content);
			const doc = new jsPDF();

			const body = content.map((item) => [
				item.name,
				item.description,
				item.data,
				item.initial_hour,
				item.finished_hour,
			]);
			doc.setFont("helvetica", "bolditalic");
			doc.setFontSize(14);
			doc.setTextColor("#1c271c");
			doc.text("TAREFAS DO DIA", 100, 10, {
				align: "center",
			});
			autoTable(doc, {
				theme: "grid",
				styles:{
					fontSize: 12,
					font: "helvetica",
					fontStyle: "bolditalic",
					valign: "middle",
					halign: "center",
				},
				columnStyles: { 1: { cellWidth: 70,} },
				head: [
					["Nome", "Descrição", "Data", "Hora Inicial", "Hora Final"]
				],
				body: body,
				foot: [[]]
			});

			doc.text(`${format(new Date(), "dd/MM/yyyy HH:mm:ss ") }`, 150, 280);
			return right(doc.output("arraybuffer"));
		}catch(err) {
			const error = err as { message: string };
			return left(new InfraException(error.message, 400));
		}
	}
}
