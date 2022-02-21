import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SophiaDatepickerComponent } from './sophia-datepicker.component';

describe('SophiaDatepickerComponent', () => {
  let component: SophiaDatepickerComponent;
  let fixture: ComponentFixture<SophiaDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SophiaDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SophiaDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
