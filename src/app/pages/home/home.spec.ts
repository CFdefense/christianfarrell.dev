import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { Project } from '../../models/project.model';

describe('HomeComponent State Management', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start with no active item selected', () => {
    expect(component.activeItem).toBeNull();
  });

  it('should set activeItem when a project is selected', () => {
    const dummyProject: Project = {
      title: 'Dummy',
      description: 'Desc',
      tags: ['A'],
      year: 2026
    };
    component.setActiveItem(dummyProject);
    expect(component.activeItem).toBe(dummyProject);
  });
});
