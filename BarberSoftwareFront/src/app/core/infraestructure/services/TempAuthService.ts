import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TempAuthService {
  private readonly KEY = 'temp_user_register_data';

  saveData(data: any): void {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }

  getData(): any | null {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  clearData(): void {
    localStorage.removeItem(this.KEY);
  }
}