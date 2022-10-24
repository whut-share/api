import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { InvalidInputException } from 'src/exceptions';

@Catch(ForbiddenException)
export class GqlForbiddenExceptionFilter implements GqlExceptionFilter {
  catch(e: ForbiddenException, host: ArgumentsHost) {
    throw new GraphQLError(e.message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}