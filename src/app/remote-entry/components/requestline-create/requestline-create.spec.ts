import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestlineCreate } from './requestline-create';

describe('RequestlineCreate', () => {
  let component: RequestlineCreate;
  let fixture: ComponentFixture<RequestlineCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestlineCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestlineCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
