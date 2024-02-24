import { Task } from "@domain/task/task";


export class TaskPresenter {
	public static ToPresenter(task: Task): {
    id: string;
    name: string;
    description: string;
    data: string;
    initial_hour: string;
    finished_hour?: string;
  } {
		return {
			id: task.getId(),
			name: task.getName(),
			description: task.getDescription(),
			// data: format(task.getStartDate(), "dd/MM/yyyy"),
			data:  new Intl.DateTimeFormat(
				"pt-BR", {
					timeZone: "America/Sao_Paulo",
					dateStyle: "short",
				}).format(task.getStartDate()),
			// initial_hour: format(task.getStartDate(), "HH:mm:ss"),
			initial_hour: new Intl.DateTimeFormat(
				"pt-BR", {
					timeZone: "America/Sao_Paulo",
					timeStyle: "medium"
				}).format(task.getStartDate()),
			...(task.getFinishDate() && {
				finished_hour:  new Intl.DateTimeFormat(
					"pt-BR", {
						timeZone: "America/Sao_Paulo",
						timeStyle: "medium"
					}).format(task.getFinishDate()),
			}),
		};
	}
}
