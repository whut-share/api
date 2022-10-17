import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { InvalidInputException } from 'src/exceptions';

@Catch(InvalidInputException)
export class InvalidInputFilter implements ExceptionFilter {
  catch(e: InvalidInputException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    response
      .status(400)
      .json({
        message: e.message,
        code: e.code,
        timestamp: new Date().toISOString(),
        statusCode: 400
      });
  }
}