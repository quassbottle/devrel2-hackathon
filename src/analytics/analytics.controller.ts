import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { HttpService } from '@nestjs/axios';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly httpService: HttpService) {}

  private readonly host = '127.0.0.1:1488';
  
  @Get('tags/all/stat')
  async getTags() {
    return this.httpService.get(this.host + 'tags/all/stat');
  }

  // fetchData(): Observable<AxiosResponse<any>> {
  //   return this.httpService.get('https://api.example.com/data');
  // }

  // // Пример метода для отправки POST-запроса с данными в теле запроса
  // postData(data: any): Observable<AxiosResponse<any>> {
  //   return this.httpService.post('https://api.example.com/post', data);
  // }
}
