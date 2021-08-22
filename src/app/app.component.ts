import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  records = ["isPrime", "isFibonacci"];
  categories = [];
  categoriesList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  inputNumber: FormControl = new FormControl();
  calBy: FormControl = new FormControl("isPrime");
  result: boolean = false;

  filter: FormControl = new FormControl();

  constructor() {
    fetch('https://api.publicapis.org/categories').then(res => res.json()).then(res => {
      this.categories = res;
      this.categoriesList.next(res);
    })

    this.filter.valueChanges.subscribe((_) => this.onFilterChange());

  }

  onInputNumberChange() {
    let inputNumber = this.inputNumber.value;
    if (inputNumber) {
      let number = Number(inputNumber);
      if (number < 0) this.inputNumber.setValue(1);
      if (number > 0) this.inputNumber.setValue(Math.round(number));
      this.onCalculate();
    }

  }

  onCalculate() {
    let calBy = this.calBy.value;
    let number = this.inputNumber.value;
    if (number) {
      if (calBy === "isPrime") this.result = this.isPrime(number);
      if (calBy === "isFibonacci") this.result = this.isFibonacci(number);
    }

  }

  isPrime(num: number) {
    if (num <= 1) return false;
    if (num % 2 == 0 && num > 2) return false;
    const s = Math.sqrt(num);
    for (let i = 3; i <= s; i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  }

  isFibonacci(num: number) {

    let isPerfectSquare = (x: number) => {
      let s = Math.sqrt(x);
      return (s * s == x);
    }

    return isPerfectSquare(5 * (num * num) - 4) || isPerfectSquare(5 * (num * num) + 4) ? true : false;

  }

  onFilterChange() {
    let search = this.filter.value;

    if (!this.categoriesList) return;

    if (!search) {
      this.categoriesList.next(this.categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.categoriesList.next(
      this.categories.filter((data: string) => data.toLowerCase().indexOf(search) > -1)
    );
  }

}
