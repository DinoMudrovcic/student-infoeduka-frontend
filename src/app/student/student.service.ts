import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { Student } from './student.model';

export interface StudentResponseData {
    token: string,
    type: string,
    username: string
  }

@Injectable()
export class StudentService {

    //endpoints
    GET_ALL_STUDENTS_URL = 'http://localhost/9001/api/user/students';

    constructor(
        private http: HttpClient
    ) {}

    getStudents(): Observable<StudentResponseData[]> {
        return this.http.post<StudentResponseData[]>(
            this.GET_ALL_STUDENTS_URL,
            {}
        );
    }

}