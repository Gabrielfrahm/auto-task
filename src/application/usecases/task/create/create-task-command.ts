export type CreateTaskCommand = {
  name: string;
  description : string;
  start_date?: Date;
  finish_date?: Date;
  created_at?: Date;
}
