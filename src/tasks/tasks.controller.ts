import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';

import { FirebaseAuthGuard } from '../auth/firebase-auth.guard.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';

@UseGuards(FirebaseAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Request() req: ExpressRequest,
    @Body() body: CreateTaskDto,
  ) {
    return this.tasksService.create(req.user!.uid, body);
  }

  @Get()
  findAll(@Request() req: ExpressRequest) {
    return this.tasksService.findAll(req.user!.uid);
  }

  @Get(':id')
  findOne(
    @Request() req: ExpressRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(id, req.user!.uid);
  }

  @Patch(':id')
  update(
    @Request() req: ExpressRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user!.uid, body);
  }

  @Delete(':id')
  remove(
    @Request() req: ExpressRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.remove(id, req.user!.uid);
  }
}
