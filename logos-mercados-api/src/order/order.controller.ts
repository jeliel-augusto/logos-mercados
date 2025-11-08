import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;

    return this.orderService.findAll(pageNum, limitNum);
  }
}
