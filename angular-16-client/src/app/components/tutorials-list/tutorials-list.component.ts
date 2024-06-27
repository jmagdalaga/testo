import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css'],
})
export class TutorialsListComponent implements OnInit {
  tutorials?: Tutorial[];
  filteredTutorials?: Tutorial[];
  title = '';
  titleChoices = ['Title 1', 'Title 2', 'Title 3', 'Title 4'];
  newTutorial: Tutorial = { title: '', description: '', published: false, isEditing: true, date: new Date(), months: {} };
  addingNewTutorial = false;
  availableYears: number[] = [];
  selectedYear: number = new Date().getFullYear();
  months: string[] = [];
  selectedTutorial: any;
  sections: any[] = [{ dropdown: '', text: '' }];

  selectTutorial(tutorial: any) {
    this.selectedTutorial = tutorial;
  }
  
  addNewSection() {
    this.sections.push({ dropdown: '', text: '' });
  }
  constructor(private tutorialService: TutorialService) {}

  ngOnInit(): void {
    this.retrieveTutorials();
    this.generateAvailableYears();
    this.onYearChange(); // Set initial months based on the current year
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll().subscribe({
      next: (data) => {
        const uniqueTutorials = data.reduce((acc: Tutorial[], curr: Tutorial) => {
          if (!acc.some(tutorial => tutorial.title === curr.title)) {
            acc.push({
              ...curr,
              isEditing: false,
              date: curr.date ? new Date(curr.date) : new Date()
            });
          }
          return acc;
        }, []);
        this.tutorials = uniqueTutorials;
        this.filterTutorialsByYear();
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchTitle(): void {
    this.tutorialService.findByTitle(this.title).subscribe({
      next: (data) => {
        const uniqueTutorials = data.reduce((acc: Tutorial[], curr: Tutorial) => {
          if (!acc.some(tutorial => tutorial.title === curr.title)) {
            acc.push({
              ...curr,
              isEditing: false,
              date: curr.date ? new Date(curr.date) : new Date()
            });
          }
          return acc;
        }, []);
        this.tutorials = uniqueTutorials;
        this.filterTutorialsByYear();
      },
      error: (e) => console.error(e)
    });
  }

  updatePublished(tutorial: Tutorial, status: boolean): void {
    const data = {
      ...tutorial,
      published: status
    };

    this.tutorialService.update(tutorial.id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  deleteTutorial(id: string): void {
    this.tutorialService.delete(id).subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  updateTutorial(tutorial: Tutorial): void {
    tutorial.isEditing = false;
    this.tutorialService.update(tutorial.id, tutorial).subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  editTutorial(tutorial: Tutorial): void {
    tutorial.isEditing = true;
  }

  cancelEdit(tutorial: Tutorial): void {
    tutorial.isEditing = false;
    this.refreshList();
  }

  addNewTutorial(): void {
    this.addingNewTutorial = true;
  }

  saveNewTutorial(): void {
    // Check if the title already exists
    const existingTutorial = this.tutorials?.find(t => t.title === this.newTutorial.title);
    if (existingTutorial) {
      alert(`Tutorial with title "${this.newTutorial.title}" already exists.`);
      return;
    }

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
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  cancelNewTutorial(): void {
    this.addingNewTutorial = false;
  }

  generateAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 2023; i <= currentYear + 5; i++) {
      this.availableYears.push(i);
    }
  }

  onYearChange(): void {
    this.generateMonths();
    this.filterTutorialsByYear();
  }

  generateMonths(): void {
    this.months = [];
    for (let i = 3; i < 15; i++) {
      const year = i < 12 ? this.selectedYear - 1 : this.selectedYear;
      const monthIndex = i % 12;
      const date = new Date(year, monthIndex, 1);
      const monthShort = date.toLocaleString('default', { month: 'short' }).toUpperCase();
      const yearShort = year.toString().slice(-2); 
      this.months.push(`${monthShort}-${yearShort}`);
    }
  }

  filterTutorialsByYear(): void {
    if (this.tutorials) {
      const startMonth = new Date(this.selectedYear - 1, 3, 1); // April of previous year
      const endMonth = new Date(this.selectedYear, 2, 31); // March of selected year
      this.filteredTutorials = this.tutorials.filter(tutorial => {
        if (tutorial.date) {
          const tutorialDate = new Date(tutorial.date);
          // Check if the tutorial date is within the correct range for selectedYear
          return tutorialDate >= startMonth && tutorialDate <= endMonth;
        }
        return false;
      });
    }
  }

  isTitleDisabled(title: string): boolean {
    return this.tutorials?.some(t => t.title === title) || false;
  }
}
