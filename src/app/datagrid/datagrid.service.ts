import { Injectable } from '@angular/core';
import { isFirefox } from './shared/navigator-utils';
import { UndoManagerService } from './services/undo-manager.service';

@Injectable()
export class DatagridService {

  selectedElement: any;
  selectedElementId: string;



  constructor(private undoManegerService: UndoManagerService) { }


  selectElement(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = 'selected';
      this.selectedElement = element;
      this.selectedElementId = element.id;
    }
  }

  removeSelection(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = '';
      this.cancelCellEdition(element, true);
    }
  }


  cancelCellEdition(element, saveElement: boolean, editable?: boolean) {
    if (element.children.length > 1) {
      if (saveElement) {
        this.undoManegerService.addToBuffer(
          {
            id: element.id,
            oldValue: element.children[0].textContent,
            newValue: element.children[1].value
          });
        element.children[0].textContent = element.children[1].value;
      }
      element.removeChild(element.children[1]);
      element.children[0].style.display = 'inherit';
    } else if (editable) {
      this.addInput(element);
    }
  }

  addInput(element, replaceContent?: boolean, keyChar?: string) {
    if (element.children[1]) {
      return;
    }
    const input = document.createElement('input');
    input.type = 'text';
    if (!replaceContent) {
      input.value = element.children[0] ? element.children[0].textContent : '';
    }
    element.appendChild(input);
    element.children[0].style.display = 'none';
    input.style.border = 'none';
    input.style.width = '60px';
    input.style.height = '12px';
    input.style.font = '12px sans-serif';
    input.style.outline = 'none';
    input.focus();

    if (keyChar && isFirefox()) {
      input.value = keyChar;
    }
  }

  editOnHitKey(element, replaceContent: boolean, keyChar?: string, event?) {
    this.addInput(element, replaceContent, keyChar);
  }
}
