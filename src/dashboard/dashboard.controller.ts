import { Controller, Post } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mercancia')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post('dasboard-mercancia')
  sendDashboard() {
    return this.dashboardService.sendDataMerca();
  }

  @Post('dasboard-trabajador')
  sendDashboardDepto() {
    return this.dashboardService.sendDataDepto();
  }
}
