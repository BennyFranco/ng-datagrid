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
  private area: Array<String> = [];
  private pressed: boolean = false;
  private originRow: String;
  private originCell: String;
  private event: MouseEvent;

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
      var id = rowId+'-'+cellId;
      this.originRow = rowId;
      this.originCell = cellId;

      document.getElementById(id).className = 'newClass';
      
    }else{
      this.pressed=false;
    }
    
  }
  onSelection(cellId, rowId, event: MouseEvent){

    if(this.pressed){
       var idXY = rowId+'-'+cellId;
       var limitCell= cellId;
       var limitRow=rowId;
       var nuevo;

       if(cellId!=this.originCell){
         for(var i=0; i<=limitCell;i++){
          nuevo=this.originRow + '-'+cellId;
          document.getElementById(nuevo).className = 'newClass';
         }
       }
       if(cellId!=this.originRow){
        for(var i=0; i<=limitRow;i++){
          nuevo=rowId + '-'+this.originCell;
          document.getElementById(nuevo).className = 'newClass';
         }
       }

       
       

    }
  }

  onSelectionEnd(cellId, rowId) {
    this.pressed= false;
    var id = rowId+'-'+cellId;
    //console.log(id);
   // console.log('En el método onSelectionEnd');
    document.getElementById(id).className = 'newClass';
  }

}
