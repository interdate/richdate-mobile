import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideoChatPage } from './video-chat';

@NgModule({
  declarations: [
    VideoChatPage,
  ],
  imports: [
    IonicPageModule.forChild(VideoChatPage),
  ],
})
export class VideoChatPageModule {}
