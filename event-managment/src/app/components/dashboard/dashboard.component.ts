import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import Chart from 'chart.js/auto';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './add-task/add-task.component';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  chart: any = [];
  tasks: any = [];
  username: string = '';
  userId: string = '';

  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    private dataService: DataService,
    private http: HttpService
  ) {}
  ngOnInit(): void {
    this.dataService.tasks.subscribe((tasks) => {
      this.tasks = tasks;
    });
    this.auth.user.subscribe((user: any) => {
      this.username = user.username;
      this.userId = user._id;
    });
    this.setTasks();
    // time log chart
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        datasets: [
          {
            label: 'Activity',
            data: [12, 19, 3, 5, 2, 3, 10],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(157, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
              'rgba(157, 203, 207)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  addTask(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(AddTaskComponent, {
      width: '500px',
      data: {
        userId: this.userId,
      },
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  setTasks() {
    this.dataService.getAllTasks(this.userId);
  }

  updateStatus(taskId: string, index:number) {
    this.http.updateTaskStatus(this.userId, taskId).subscribe((res:{message:string}) => {
      this.tasks.splice(index,1);
      if(res.message === 'success'){

      }
    });
  }
}
