import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../commonservices.service';
import { Family } from '../_models/Family';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../_services';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

declare var $: any;

@Component({
  selector: 'cdk-drag-drop-connected-sorting-example',
  templateUrl: './addfamily.component.html',
  styleUrls: ['addfamily.component.css'],
  //styleUrls: ['./addproduct.component.scss']
})
export class AddfamilyComponent implements OnInit {
  elements: any = [];
  FamilyName: any;
  Formfileds: any = { FamilyName: '' }
  todo = [

  ];

  done = [

  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  loading: string = "Loading wait..."
  serverresponse: string = '';
  servererror: number = 0;
  paramFamilyBody = new Family();
  constructor(public commonservice: CommonServiceService, private alertService: AlertService, private formBuilder: FormBuilder) {

    Window["myComponent"] = this;


  }
  test() {
    //alert('hi')
    var ddd = $("customFormAdd")
    //console.log("testing");
    this.submitAddProduct();
  }

  getProcess() {
    this.commonservice.getProcess().subscribe(
      dataList => {
        dataList = JSON.parse(dataList);
        this.elements = dataList['result'];
        for (let entry of this.elements) {
          console.log(entry); // 1, "string", false
          if (entry.Status == "Active")
            this.todo.push(entry.MachineName);
        }

        this.loading = "";
        //console.log(this.controlListString);
      },
      err => console.log(err)
    );
  }

  f: NgForm;
  ngOnInit(): void {
    this.getProcess();
    //this.paramProductBody.Id=0;
  }



  submitAddProduct() {
    this.commonservice.addFamily({ FamilyName: this.paramFamilyBody.FamilyName, familyProcess: this.done }).subscribe(
      dataList => {

        console.log(dataList);
        this.servererror = dataList.error;
        this.serverresponse = dataList.message;
        if (dataList.error == 0) {

          // this.paramFamilyBody.FamilyName = "";
          this.done = [];
        }
        //product.reset()
        // this.alertService.success("Add Product");


      },
      err => console.log(err)
    );
    console.log(this.done, this.paramFamilyBody);



  }


}
