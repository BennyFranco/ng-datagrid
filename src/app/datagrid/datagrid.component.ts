import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { DatagridService } from './datagrid.service';

@Component({
  selector: 'ng-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css']
})
export class DatagridComponent implements OnInit, AfterViewInit {

  @Input() gridData: Array<any>;
  @Input() headers: Array<any>;
  @Output() gridDataChange = new EventEmitter();
  @Output() onCellChange;

  rowLimit: number;
  colLimit: number;
  color: string;
  private area: Array<any> = [];
  pressed: boolean = false;
  private event: MouseEvent;
  private 


  constructor(private datagridService: DatagridService) {
    this.gridDataChange = this.datagridService.gridDataChange;
    this.onCellChange = this.datagridService.onCellChange;
  }

  ngOnInit() {
    if (!this.gridData) {
      this.gridData = this.datagridService.generateEmptySheetWithNumberOfRows(15);
    }

    if (!this.headers) {
      this.headers = this.generateHeaders();
    }

    this.createRowAndColLimits();
    this.datagridService.gridData = this.gridData;
  }

  ngAfterViewInit() {
    this.datagridService.selectElement(null, '0-0');
  }

  private createRowAndColLimits() {
    this.rowLimit = this.gridData.length;
    if (this.gridData.length > 0) {
      this.colLimit = this.gridData[0].length;
    }
  }

  private generateHeaders(): Array<any> {
    const letters = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.toUpperCase().split(' ');
    const headers = [];
    if (this.gridData.length > 0) {
      ([...this.gridData].pop()).forEach((element, idx) => headers.push(letters[idx]));
    }
    return headers;
  }

onSelectionStart(cellId, rowId) { // 'row-column'  ex. '0-0' '0-1'
    if(!this.pressed){
      this.pressed= true;
      console.log('En el método onSelectionStart');
      var id = rowId+'-'+cellId;
      console.log(id);
      document.getElementById(id).className = 'newClass';
    }else{
      this.pressed=false;
    }
    
  }
  onSelection(cellId, rowId, event: MouseEvent){
    console.log('En el método onSelection');
    if(this.pressed){
        if(event.clientX && cellId || event.clientY && rowId){
          console.log('En event X '+ cellId);
          console.log('En event Y '+ rowId);
          var id = rowId+'-'+cellId;
          console.log(id);
          document.getElementById(id).className = 'newClass';

          
        }
        
      
    }
    // si se muebe en y el limite seria en x y si es en x el limite seria x
    
  }
  onSelectionEnd(cellId, rowId) {
    this.pressed= false;
    var id = rowId+'-'+cellId;
    console.log(id);
    console.log('En el método onSelectionEnd');
  }

}
