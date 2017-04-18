import { Injectable } from '@angular/core';
import { BufferedObject } from './buffered-object';

@Injectable()
export class UndoManagerService {

  stack = [];
  stackPos = -1;
  bufferLimit = 15;

  constructor() { }

  addToBuffer(element: BufferedObject) {
    if (this.stack.length !== this.bufferLimit) {
      if (this.stack.length > 0 && this.stack.length - 1 !== this.stackPos) {
        this.stack[this.stackPos + 1] = element;
        this.stack = this.stack.slice(0, this.stackPos + 2);
      } else {
        this.stack.push(element);
      }
      this.stackPos += 1;
    } else {
      this.stackPos--;
      this.stack.shift();
      this.addToBuffer(element);
    }
  }

  undo() {
    if (this.stackPos > -1) {
      const lastElementModified = document.getElementById(this.stack[this.stackPos].id);
      lastElementModified.firstElementChild.textContent = this.stack[this.stackPos].oldValue;
      if (this.stackPos > -1) {
        this.stackPos--;
      }
    }
  }

  redo() {
    if (this.stackPos != (this.stack.length - 1)) {
      this.stackPos++;
      const lastElementModified = document.getElementById(this.stack[this.stackPos].id);
      lastElementModified.firstElementChild.textContent = this.stack[this.stackPos].newValue;
    }
  }

  cleanBuffer() {
    this.stack = [];
    this.stackPos = -1;
  }
}
