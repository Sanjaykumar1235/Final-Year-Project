import { Module } from '@nestjs/common';
import { CredentialController } from './credential/credential.controller';
import { zoomController } from './xapps/Zoom app/Meeting/zoom.controller';
import { EmailController } from './xapps/Zoom app/Ema/email.controller';
import { sinchController } from './xapps/Sinch App/sinch.controller';
import { wassengerController } from './xapps/Wassenger/wassenger.controller';
import { AttendanceController } from './xapps/Zoom app/Attendence/attendence.controller';



@Module({
  imports: [],
  controllers: [CredentialController,zoomController,EmailController,wassengerController,AttendanceController],
  providers: [],
})
export class AppModule {}
