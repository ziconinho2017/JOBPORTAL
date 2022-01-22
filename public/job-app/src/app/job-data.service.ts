import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Job } from './jobs/jobs.component';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobDataService {
  #baseUrl =  "http://localhost:4000/api/";
  constructor(private httpC : HttpClient) { }
  public getJobService(params : HttpParams) : Promise<Job[]>{
    console.log("Get Job Data Service Function");
    const url = this.#baseUrl+"jobs";
    return lastValueFrom(this.httpC.get(url,{params : params}))
        .then(resolve => resolve as Job[])
        .catch(this.handleError);
  }
  private handleError(error: any) : Promise<any>{
    console.log(error);
    return Promise.reject(error.message || error);
  }
}
