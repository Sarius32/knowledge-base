import { Component, OnDestroy, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  unSubs: Subscription[] = [];

  all: Item[] = [];
  websites: Item[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const col = collection(this.firestore, 'websites');
    this.unSubs.push(
      (collectionData(col) as Observable<Item[]>).subscribe((data) => {
        this.all = [...data];
        this.all.sort((a, b) => a.name.localeCompare(b.name));
        this.all.forEach((site) => {
          try {
            site.keywords = site.keywords.sort((a, b) => a.localeCompare(b));
          } catch (e) {
            console.log(e);
          }
        });
        this.websites = [...this.all];
      })
    );
  }

  ngOnDestroy(): void {
    this.unSubs.forEach((sub) => sub.unsubscribe());
  }
}

interface Item {
  name: string;
  description: string;
  url: string;
  keywords: string[];
}
