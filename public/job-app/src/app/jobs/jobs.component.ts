import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobDataService } from '../job-data.service';
export class Job{
  #title!: string;
  #salary!: number;
  #location!: string;
  get title(): string{return this.#title}
  get salary(): number{return this.#salary}
  get location(): string{return this.#location}
  constructor(title : string, salary:number, location:string){
    this.#title = title;
    this.#salary = salary;
    this.#location = location;
  }
}
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs:Job[] = [];
  constructor(private jobDataService : JobDataService, private route : ActivatedRoute) { }
  ngOnInit(): void {
    let httpparams = new HttpParams();
    this.route.queryParams.subscribe(params=>{
      if(params['ltm']){
        httpparams.append('ltm',6);
      }
      if(params['count']){
        httpparams.append('count',2);
      }
      if(params['offset']){
        httpparams.append('offset',0);
      }
    });
    console.log(httpparams);
    if(httpparams.has('count') || httpparams.has('offset') || httpparams.has('ltm')){
      console.log(httpparams);
      this.jobDataService.getJobByFilter(httpparams)
      .then(resolve => this._setJobs(resolve))
      .catch(this._errorHandle);
    }else{
      this.jobDataService.getJobService()
      .then(resolve => this._setJobs(resolve))
      .catch(this._errorHandle);
    }
  }
  private _setJobs(Jobs : Job[]){
    console.log("Set Jobs");
    this.jobs = Jobs;
  }
  private _errorHandle(){
    console.log("Error occured while requesting Jobs");
  }
}
