export interface UseCase<Inp, Out> {
  execute(command: Inp ) : Promise<Out>
}
