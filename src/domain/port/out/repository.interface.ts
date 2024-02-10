import { Either } from "@shared/either";

export interface Repository<E> {
  create(entity: E): Promise<Either<unknown, E | void>>
  findAll(): Promise<Either<unknown, E[] | unknown |void>>
}
