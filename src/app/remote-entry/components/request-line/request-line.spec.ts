import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLine } from './request-line';

describe('RequestLine', () => {
  let component: RequestLine;
  let fixture: ComponentFixture<RequestLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestLine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestLine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
