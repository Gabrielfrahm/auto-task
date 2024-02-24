import { UseCase } from "@application/usecases/use-case.interface";
import { GeneratePdfCommand } from "./generate-pdf-command";
import { GeneratePdfOutput } from "./generate-pdf-output";
import { TaskRepositoryPort } from "@domain/port/out/persistence/task/task-repository.port";
import { InfraException } from "@shared/errors/infra.error";
import { left, right } from "@shared/either";
import { ApplicationException } from "@shared/errors/application.error";
import { PdfPort } from "@domain/port/out/pdf/pdf.port";
import { TaskPresenter } from "@application/presenter/task/task.presenter";


export class GeneratePdfUseCase implements UseCase<GeneratePdfCommand, GeneratePdfOutput>{

	public constructor(
    private readonly taskRepository : TaskRepositoryPort,
    private readonly pdfService: PdfPort,
	) {
		this.taskRepository = taskRepository;
	}

	async execute(command: GeneratePdfCommand): Promise<GeneratePdfOutput> {
		try {
			const tasks = await this.taskRepository.findAllByDate(command.date);

			if(tasks.isLeft()){
				throw tasks.value;
			}

			const pdfBuffer = await this.pdfService.createPdf(tasks.value.map((task) => TaskPresenter.ToPresenter(task)));

			if(pdfBuffer.isLeft()){
				throw pdfBuffer.value;
			}

			return right(pdfBuffer.value);
		}catch(err) {
			if (err instanceof InfraException) {
				return left(err);
			} else {
				const error = err as { message: string };
				return left(new ApplicationException(error.message, 400));
			}
		}
	}
}
