import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentCachingComponent } from './dialog-content-caching.component';

describe('DialogContentCachingComponent', () => {
  let component: DialogContentCachingComponent;
  let fixture: ComponentFixture<DialogContentCachingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogContentCachingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentCachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
