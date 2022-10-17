import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { InvalidInputException } from 'src/exceptions';

@Catch(InvalidInputException)
export class GqlInvalidInputFilter implements GqlExceptionFilter {
  catch(e: InvalidInputException, host: ArgumentsHost) {
    return new GraphQLError(e.message, {
      extensions: {
        code: e.code,
      },
    });
  }
}