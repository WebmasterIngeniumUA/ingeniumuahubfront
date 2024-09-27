import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-popupz-public-tracker',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf
  ],
  providers: [
    { provide: Window, useValue: window }
  ],
  templateUrl: './popupz-public-tracker.component.html',
})
export class PopupzPublicTrackerComponent implements AfterViewInit {
  @ViewChild('inprogress') inProgress: ElementRef = null!;
  @ViewChild('completed') completed: ElementRef = null!;

  previousTimestamp: DOMHighResTimeStamp = 0;
  movingDirection: number[] = [0, 0]; // -1 = up, 0 = available, 1 = down, 2 = WAIT
  inProgressOrder: number[] = [];

  constructor(@Inject(Window) private readonly window: Window) {
    // Create 1000 random integers from 1 to 1000
    for (let i = 0; i < 100; i++) {
      this.inProgressOrder.push(Math.floor(Math.random() * 1000) + 1);
    }
  }

  ngAfterViewInit() {
    this.scrollLists(0)
  }

  scrollLists(timestamp: DOMHighResTimeStamp) {
    const delta = timestamp - this.previousTimestamp;
    this.checkForOverflowingContent(this.inProgress, 0, delta);
    this.checkForOverflowingContent(this.completed, 1, delta);
    this.previousTimestamp = timestamp;

    this.window.requestAnimationFrame((time) => {
      this.scrollLists(time);
    });
  }

  checkForOverflowingContent(ref: ElementRef, index: number, delta: number) {
    const element = ref.nativeElement;

    // If we are in waiting mode or there is no overflow, do nothing
    if (this.movingDirection[index] === 2 || element.scrollHeight <= element.clientHeight) {
      return;
    }

    // Are we at the top of the list? If so, move slowly to the bottom
    if (element.scrollTop === 0 && this.movingDirection[index] === 0) {
      this.movingDirection[index] = 1; // Move down
    } else if (element.scrollTop === element.scrollHeight - element.clientHeight && this.movingDirection[index] === 0) {
      this.movingDirection[index] = -1; // Move up
    }

    // Calculate the new scroll position
    const amountToScroll = element.scrollHeight - element.clientHeight;
    let amountLeftToScroll = element.scrollTop;
    if (this.movingDirection[index] === 1) {
      amountLeftToScroll = amountToScroll - element.scrollTop;
    }

    // Calculate the delta
    const scrollDelta = this.getEasingDelta(amountLeftToScroll / amountToScroll);
    element.scrollTop += Math.ceil(scrollDelta) * delta * this.movingDirection[index] * 0.1; // 0.1 is the speed

    if (amountLeftToScroll === 0) {
      this.movingDirection[index] = 2;
      setTimeout(() => {
        this.movingDirection[index] = 0;
      }, 5000);
    }
  }

  getEasingDelta(x: number) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }
}