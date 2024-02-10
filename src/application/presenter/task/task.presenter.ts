import { Task } from "@domain/task/task";
import { format } from "date-fns";

export class TaskPresenter {
	public static ToPresenter(task: Task) {
		return {
			id: task.getId(),
			name: task.getName(),
			description: task.getDescription(),
			data: format(task.getStartDate(), "dd/MM/yyyy"),
			initial_hour: format(task.getStartDate(), "HH:mm:ss"),
			...(task.getFinishDate() && {
				finished_hour: format(task.getFinishDate(), "HH:mm:ss"),
			}),
		};
	}
}
