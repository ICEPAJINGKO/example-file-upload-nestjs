import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' คือ field name ของไฟล์ใน form data
  async uploadFile(@UploadedFile() file, @Body() body: any) {
    console.log(typeof body.data, body.data);
    const jsonData = JSON.parse(body.data);
    console.log(typeof jsonData, jsonData);

    console.log('filename', file.filename);

    const destDirectory = './destfiles';
    const destFilePath = path.join(destDirectory, file.filename);

    fs.renameSync(file.path, destFilePath);

    return {
      status: 'success',
      message: `batch file compltet at ${destFilePath}`,
    };

    // file.buffer จะมีข้อมูลของไฟล์
    // file.originalname จะมีชื่อเดิมของไฟล์
    // file.path จะเป็นตำแหน่งที่ไฟล์ถูกบันทึกไว้
    // ทำตามที่คุณต้องการ
    // console.log(file.buffer);
    // console.log(file.originalname);
    // console.log(file.path);
    // console.log(body.data);

    // return {
    //   buffer: file.buffer,
    //   originalname: file.originalname,
    //   path: file.path,
    //   data1: body.data,
    //   data2: JSON.stringify(body.data),
    // };
  }
}
