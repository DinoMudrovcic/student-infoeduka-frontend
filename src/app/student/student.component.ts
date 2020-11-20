import { Component, OnInit } from '@angular/core';
import { Student } from './student.model';
import { StudentService } from './student.service';

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit {

    students: Student[] = [];


    constructor(private service: StudentService) {}
    ngOnInit() {
        this.service.getStudents().subscribe(resData => {
            resData.forEach(data => {
                this.students.push(
                    new Student(
                        data.username,
                        '',
                        ''
                    )
                )
            })
        });
    }


}