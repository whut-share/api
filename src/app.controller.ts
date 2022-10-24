import { BadRequestException, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private webhook_test_fail: boolean = false;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post('webhooks/test')
  webhooksTest() {

    if(this.webhook_test_fail) {
      throw new BadRequestException('Testing error from the webhook - this should trigger the webhook loop timeout')
    } else {
      return { ok: true };
    }
  }


  @Get('webhooks/test/fail')
  makeWebhookFail(@Res() res: Response) {
    this.webhook_test_fail = true;

    return { ok: true }
  }


  @Get('webhooks/test/success')
  makeWebhookSuccess(@Res() res: Response) {
    this.webhook_test_fail = false;
    
    return { ok: true }
  }
}
