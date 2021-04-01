import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Platform } from "@ionic/angular";
import { DeviceMotion, DeviceMotionAccelerationData } from "@ionic-native/device-motion/ngx";
import { Shake } from '@ionic-native/shake/ngx';

@Component({
  selector: 'app-canvas-draw',
  templateUrl: './canvas-draw.component.html',
  styleUrls: ['./canvas-draw.component.scss'],
})

export class CanvasDrawComponent implements OnInit {

  @ViewChild('myCanvas') canvas: any;


  last_x = null;
  last_y = null;
  last_z = null;

  watch = null;
  subscription = null;

  canvasElement: any;
  lastX: number;
  lastY: number;

  currentColour: string = '#1abc9c';
  availableColours: any;

  brushSize: number = 10;

  constructor(public platform: Platform, public renderer: Renderer2, private deviceMotion: DeviceMotion, public shake: Shake) {
    console.log('Hello CanvasDraw Component');

    this.availableColours = [
      '#1abc9c',
      '#3498db',
      '#9b59b6',
      '#e67e22',
      '#e74c3c',
      '#ffffff'
    ];
  }

  ngOnInit() { }

  ngAfterViewInit() {

    this.canvasElement = this.canvas.nativeElement;

    this.renderer.setAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setAttribute(this.canvasElement, 'height', this.platform.height() * 0.83 + '');

    if (this.platform.is("ios")) {
      this.watch = this.shake.startWatch(60).subscribe(() => {
        this.clearCanvas();
      });
    } else if (this.platform.is("android")) {

      this.subscription = this.deviceMotion.watchAcceleration({ frequency: 200 }).subscribe((acceleration: DeviceMotionAccelerationData) => {

        if (!this.last_x) {
          this.last_x = acceleration.x;
          this.last_y = acceleration.y;
          this.last_z = acceleration.z;
        }

        let deltaX: number, deltaY: number, deltaZ: number;
        deltaX = Math.abs(acceleration.x - this.last_x);
        deltaY = Math.abs(acceleration.y - this.last_y);
        deltaZ = Math.abs(acceleration.z - this.last_z);

        if (deltaX + deltaY + deltaZ > 3) {
          this.clearCanvas();
        }

        this.last_x = acceleration.x;
        this.last_y = acceleration.y;
        this.last_z = acceleration.z;

      });
    }

  }

  changeColour(colour) {
    this.currentColour = colour;
  }

  changeSize(size) {
    this.brushSize = size;
  }

  handleStart(ev) {
    this.lastX = ev.touches[0].pageX;
    this.lastY = ev.touches[0].pageY;
  }

  handleMove(ev) {

    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY;

    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();
    ctx.strokeStyle = this.currentColour;
    ctx.lineWidth = this.brushSize;
    ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;

  }

  clearCanvas() {
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

}
