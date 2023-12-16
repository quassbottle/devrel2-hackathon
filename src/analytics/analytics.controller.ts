import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly httpService: HttpService) {}

  private readonly host = 'http://127.0.0.1:1488/tags/all/stat';
  
  @Get('tags/all/stat')
  async getTags() {
    console.log(this.host);
    return axios.get(this.host);
  }

  // fetchData(): Observable<AxiosResponse<any>> {
  //   return this.httpService.get('https://api.example.com/data');
  // }

  // // Пример метода для отправки POST-запроса с данными в теле запроса
  // postData(data: any): Observable<AxiosResponse<any>> {
  //   return this.httpService.post('https://api.example.com/post', data);
  // }
}
