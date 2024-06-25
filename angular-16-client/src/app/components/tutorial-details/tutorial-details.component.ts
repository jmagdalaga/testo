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
  newTutorial: Tutorial = { title: '', description: '', published: false, isEditing: true, date: new Date(), months: {} };
  addingNewTutorial = false;
  months: string[] = [];

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
      published: this.newTutorial.published,
      date: this.newTutorial.date,
      ...this.months.reduce((acc, month) => ({ ...acc, [month]: this.newTutorial[month] || '' }), {})
    };

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.addingNewTutorial = false;
        this.loadItems();
      },
      error: (e) => console.error(e)
    });
  }

  editTutorial(tutorial: Tutorial): void {
    tutorial.isEditing = true;
  }

  updateTutorial(tutorial: Tutorial): void {
    tutorial.isEditing = false;
    this.tutorialService.update(tutorial.id, tutorial).subscribe({
      next: (res) => {
        console.log(res);
        this.loadItems();
      },
      error: (e) => console.error(e)
    });
  }

  deleteTutorial(id: string): void {
    this.tutorialService.delete(id).subscribe({
      next: (res) => {
        console.log(res);
        this.loadItems();
      },
      error: (e) => console.error(e)
    });
  }

  cancelEdit(tutorial: Tutorial): void {
    tutorial.isEditing = false;
    this.loadItems();
  }

  cancelNewTutorial(): void {
    this.addingNewTutorial = false;
  }

  generateMonths(): void {
    this.months = [];
    const currentYear = new Date().getFullYear();
    for (let i = 3; i < 15; i++) {
      const year = i < 12 ? currentYear - 1 : currentYear;
      const monthIndex = i % 12;
      const date = new Date(year, monthIndex, 1);
      const monthShort = date.toLocaleString('default', { month: 'short' }).toUpperCase();
      const yearShort = year.toString().slice(-2); 
      this.months.push(`${monthShort}-${yearShort}`);
    }
  }
}
