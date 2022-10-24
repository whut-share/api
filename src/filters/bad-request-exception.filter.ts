import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { InvalidInputException } from 'src/exceptions';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(e: BadRequestException, host: ArgumentsHost) {

    if(host.getType<GqlContextType>() === 'graphql') {
      return new GraphQLError(e.message, {
        extensions: {
          code: 'BAD_INPUT',
        },
      });
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      
      response
        .status(400)
        .json({
          message: e.message,
          timestamp: new Date().toISOString(),
          statusCode: 400
        });
    }
  }
}