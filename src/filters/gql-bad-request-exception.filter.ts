import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { InvalidInputException } from 'src/exceptions';

@Catch(BadRequestException)
export class GqlBadRequestExceptionFilter implements GqlExceptionFilter {
  catch(e: BadRequestException, host: ArgumentsHost) {
    const res = e.getResponse() as any;
    
    return new GraphQLError(res.message, {
      extensions: {
        code: 'BAD_INPUT',
      },
    });
  }
}