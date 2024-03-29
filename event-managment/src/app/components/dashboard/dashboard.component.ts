import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js/auto';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './add-task/add-task.component';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { startOfWeek, endOfWeek, addDays, format } from 'date-fns';

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
  currentWeekDays: { day: string; timeSpent: number }[] = [];
  data: number[] = [];

  constructor(
    private auth: AuthService,
    public dialog: MatDialog,
    private dataService: DataService,
    private http: HttpService
  ) {}
  ngOnInit(): void {
    this.getDisplayData();
    const week: string[] = this.getCurrentWeekDates();

    week.map((day) => {
      this.currentWeekDays.push({ day: format(day, 'dd MMMM'), timeSpent: 0 });
    });

    this.dataService.tasks.subscribe((res) => {
      if (res.length !== 0) {
        this.tasks = res;
      }
    });
    this.auth.user.subscribe((user: any) => {
      if (user !== null) {
        this.username = user.username;
        this.userId = user._id;
      }
      return;
    });

    // get activity of user
    this.http.getActivity().subscribe((res: any) => {
      res.activity.forEach((element: { date: string; timeSpent: number }) => {
        this.currentWeekDays.forEach((day) => {
          if (day.day === format(element.date, 'dd MMMM')) {
            day.timeSpent = +element.timeSpent;
          }
        });
      });

      // time log chart
      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: this.getLabels(),
          datasets: [
            {
              label: 'Minutes',
              data: this.getData(),
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
    });

    this.setTasks();
  }

  getLabels() {
    return this.currentWeekDays.map((day) => {
      return day.day;
    });
  }

  getData() {
    return this.currentWeekDays.map((day) => {
      return day.timeSpent;
    });
  }

  getDisplayData() {
    this.http.getDashboardData().subscribe((data) => {
      console.log(data);
    });
  }

  getCurrentWeekDates() {
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
    const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

    const weekDates = [];
    let currentDateInWeek = startOfCurrentWeek;

    while (currentDateInWeek <= endOfCurrentWeek) {
      weekDates.push(format(currentDateInWeek, 'yyyy-MM-dd'));
      currentDateInWeek = addDays(currentDateInWeek, 1);
    }

    // Format and display the dates
    // weekDates.forEach(date => {
    //   console.log(format(date, 'yyyy-MM-dd')); // Output in the format 'yyyy-MM-dd'
    // });
    return weekDates;
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

  updateStatus(taskId: string, index: number) {
    this.http
      .updateTaskStatus(this.userId, taskId)
      .subscribe((res: { message: string }) => {
        this.tasks.splice(index, 1);
        if (res.message === 'success') {
          Swal.fire({
            title: 'Success',
            text: 'Task updated!',
            icon: 'success',
          });
        }
      });
  }
}
