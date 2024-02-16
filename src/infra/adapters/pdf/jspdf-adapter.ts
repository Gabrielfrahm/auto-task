import { PdfPort } from "@domain/port/out/pdf/pdf.port";

import { Either, left, right } from "@shared/either";
import { InfraException } from "@shared/errors/infra.error";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Task } from "@domain/task/task";
import { format } from "date-fns";

export class JsPdfAdapter implements PdfPort {
	async createPdf(content: Task[] ): Promise<Either<Error, ArrayBuffer>> {
		try{

			const doc = new jsPDF();

			const body = content.map((item) => [
				item.getName(),
				item.getDescription(),
				format(item.getStartDate(), "dd/MM/yyyy"),
				format(item.getStartDate(), "HH:mm:ss"),
				item.getFinishDate() && format(item.getFinishDate(), "HH:mm:ss")
			]);

			autoTable(doc, {
				head: [["Nome", "Descrição", "Data", "Hora Inicial", "Hora Final"]],
				body: body,
			});
			return right(doc.output("arraybuffer"));
		}catch(err) {
			console.log(err);
			const error = err as { message: string };
			return left(new InfraException(error.message, 400));
		}
	}
}
