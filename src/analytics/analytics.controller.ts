import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { AnalyticsRecommendTagsDto } from './dto/recommend-tags.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly httpService: HttpService) {}

  private readonly host = 'http://ml-api:1488/tags/all/stat';
  
  @Get('tags/all/stat')
  async getTags() {
    return (await axios.get('http://ml-api:1488/tags/all/stat')).data;
  }

  @ApiParam({
    type: Number,
    name: 'id',
  })
  @Get('events/:id')
  async getEventById(@Param('id', ParseIntPipe) id) {
    return (await axios.get('http://ml-api:1488/events/' + id)).data;
  }

  
  @ApiBody({
    type: AnalyticsRecommendTagsDto
  })
  @Post('tags')
  async getRecByTags(@Body() dto: AnalyticsRecommendTagsDto) {
    const res = await axios.post('http://ml-api:1488/tags/', { ...dto } );
    return res.data;
  }

  // fetchData(): Observable<AxiosResponse<any>> {
  //   return this.httpService.get('https://api.example.com/data');
  // }

  // // Пример метода для отправки POST-запроса с данными в теле запроса
  // postData(data: any): Observable<AxiosResponse<any>> {
  //   return this.httpService.post('https://api.example.com/post', data);
  // }
}
