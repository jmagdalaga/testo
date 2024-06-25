import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';

@Component({
  selector: 'app-tutorial-detail',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css']
})
export class TutorialDetailsComponent implements OnInit {
  title: string = '';
  tutorials: Tutorial[] = [];
  newTutorial: Tutorial = { title: '', description: '', month_year: '', currency: '', amount: 0, usd_amount: 0, spot_rate: 0, section: '', department: '', published: false, isEditing: true, date: new Date(), months: {} };
  addingNewTutorial = false;
  months: string[] = [];
  currencies: string[] = ['PHP', 'YEN'];

  // Conversion rates
  conversionRates: { [key: string]: number } = {
    'PHP': 0.018, // Example rate: 1 PHP = 0.018 USD
    'YEN': 0.009, // Example rate: 1 YEN = 0.009 USD
  };

  constructor(private route: ActivatedRoute, private tutorialService: TutorialService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.title = params['title'];
      this.newTutorial.title = this.title;
      this.generateMonths();
      this.loadItems();
    });
  }

  loadItems(): void {
    this.tutorialService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.tutorials = data.map(tutorial => ({
          ...tutorial,
          isEditing: false,
          date: tutorial.date ? new Date(tutorial.date) : new Date()
        }));
      },
      error: (e) => console.error(e)
    });
  }

  addNewTutorial(): void {
    this.addingNewTutorial = true;
  }

  saveNewTutorial(): void {
    const data = {
      title: this.newTutorial.title,
      description: this.newTutorial.description,
      month_year: this.newTutorial.month_year,
      currency: this.newTutorial.currency,
      amount: this.newTutorial.amount,
      usd_amount: this.newTutorial.usd_amount,
      spot_rate: this.newTutorial.spot_rate,
      section: this.newTutorial.section,
      department: this.newTutorial.department,
      published: this.newTutorial.published,
      date: this.newTutorial.date
    };

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        this.addingNewTutorial = false;
        this.loadItems();
      },
      error: (e) => console.error(e)
    });
  }

  cancelNewTutorial(): void {
    this.addingNewTutorial = false;
  }

  editTutorial(tutorial: Tutorial): void {
    tutorial.isEditing = true;
  }

  updateTutorial(tutorial: Tutorial): void {
    tutorial.isEditing = false;
    this.tutorialService.update(tutorial.id, tutorial).subscribe({
      next: (res) => {
        this.loadItems();
      },
      error: (e) => console.error(e)
    });
  }

  deleteTutorial(id: string): void {
    this.tutorialService.delete(id).subscribe({
      next: (res) => {
        this.loadItems();
      },
      error: (e) => console.error(e)
    });
  }

  cancelEdit(tutorial: Tutorial): void {
    tutorial.isEditing = false;
    this.loadItems();
  }

  convertAmount(tutorial: Tutorial): void {
    if (tutorial.currency && tutorial.amount !== undefined) {
      const rate = this.conversionRates[tutorial.currency];
      if (rate !== undefined) {
        tutorial.usd_amount = parseFloat((tutorial.amount * rate).toFixed(2));
      }
    }
  }

  generateMonths(): void {
    const selectedYear = new Date().getFullYear();
    for (let i = 3; i < 15; i++) {
      const year = i < 12 ? selectedYear - 1 : selectedYear;
      const monthIndex = i % 12;
      const date = new Date(year, monthIndex, 1);
      const monthShort = date.toLocaleString('default', { month: 'short' }).toUpperCase();
      const yearShort = year.toString().slice(-2); 
      this.months.push(`${monthShort}-${yearShort}`);
    }
  }
}
