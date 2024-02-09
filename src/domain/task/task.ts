import { randomUUID } from "crypto";

export type TaskProps = {
  id?: string;
  name: string;
  description: string;
  start_date?: Date;
  finish_date?: Date;
  created_at?: Date;
}

export class Task {
	private readonly id?: string;
	private readonly name: string;
	private readonly description: string;
	private readonly start_date: Date;
	private readonly finish_date: Date;
	private readonly created_at: Date;

	private constructor(props : TaskProps){
		this.id = props.id || randomUUID();
		this.name = props.name;
		this.description = props.description;
		this.start_date = props.start_date || new Date();
		this.finish_date = props.finish_date || null;
		this.created_at = props.created_at || new Date();
	}

	public static create(props: TaskProps): Task {
		return new Task(props);
	}

	public getId(): string {
		return this.id;
	}

	public getName(): string {
		return this.name;
	}

	public getDescription(): string {
		return this.description;
	}

	public getStartDate(): Date {
		return this.start_date;
	}

	public getFinishDate(): Date {
		return this.finish_date;
	}

	public getCreatedAt(): Date {
		return this.created_at;
	}
}


