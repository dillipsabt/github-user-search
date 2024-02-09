import { Component, ViewChild } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { UserService } from '../users.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent {
  searchInput: string = '';
  searchUsers: any[] = [];
  defaultUsers: any[] = [];
  private searchSubject: Subject<string> = new Subject<string>();

  constructor(private userService: UserService) {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => {
        if (query.trim() === '') {
          return [];
        } else {
          return this.userService.searchUsers(query);
        }
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError('Error fetching users. Please try again later.');
      })
    ).subscribe((users: any[]) => {
      this.searchUsers = users;
    });

    this.userService.getUsers().subscribe((users: any[]) => {
      this.defaultUsers = users;
    });
  }

  search(): void {
    this.searchSubject.next(this.searchInput.trim());
  }
}
