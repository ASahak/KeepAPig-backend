import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../interfaces/error-response.interface';

@ObjectType()
export class InputError {
  @Field()
  field: string;

  @Field(() => [String])
  messages: string[];
}

@ObjectType({
  implements: [ErrorResponse],
})
export class InvalidInputError extends ErrorResponse {
  @Field(() => [InputError])
  errors: InputError[];

  constructor(errors: InputError[]) {
    super('Invalid input provided.');
    this.errors = errors;
  }
}
