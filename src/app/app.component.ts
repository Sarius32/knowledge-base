import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { getBlob, ref, Storage } from '@angular/fire/storage';
import { signInAnonymously } from '@firebase/auth';
import { collection } from '@firebase/firestore';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  unSubs: Subscription[] = [];

  img?: Blob;

  all: Item[] = [];
  websites: Item[] = [];

  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {}

  ngOnInit(): void {
    signInAnonymously(this.auth).then(() => {
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
      getBlob(ref(this.storage, 'cloudcraft.png')).then((blob) => {
        this.img = blob;
      });
    });
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
