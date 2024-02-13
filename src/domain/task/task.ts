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
	private id?: string;
	private name: string;
	private description: string;
	private start_date: Date;
	private finish_date: Date;
	private created_at: Date;

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

	public update(props: Partial<TaskProps>) : void {
		if(props.name) {
			this.name = props.name;
		}

		if(props.description){
			this.description = props.description;
		}

		if(props.start_date){
			this.start_date = props.start_date;
		}

		if(props.finish_date){
			this.finish_date = props.finish_date;
		}
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


