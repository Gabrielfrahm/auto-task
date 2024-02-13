export type UpdateTaskCommand = {
  id: string;
  name?: string;
  description?: string;
  start_date?: Date;
  finish_date?: Date;
}
