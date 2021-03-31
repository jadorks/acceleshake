import { Component } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from "@ionic-native/device-motion/ngx";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private deviceMotion: DeviceMotion,) {}

  ionViewWillEnter(){

  }

}
