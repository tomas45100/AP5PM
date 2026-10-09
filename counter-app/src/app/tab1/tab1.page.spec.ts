import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { Tab1Page } from './tab1.page';
import { CounterService } from '../services/counter.service';
import { Preferences } from '@capacitor/preferences';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  }
}));

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let counterService: CounterService;

  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);

  beforeEach(() => {
    vi.clearAllMocks();
    getMock.mockResolvedValue({ value: null });
    setMock.mockResolvedValue(undefined);
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    counterService = TestBed.inject(CounterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add the newest saved counter to the beginning', async () => {
    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: '2026-09-17T08:00:00.000Z',
    };
    const second: SavedCounter = {
      id: 'second',
      name: 'Druhé',
      value: 2,
      createdAt: '2026-09-17T09:00:00.000Z',
    };

    await component.onSaved(first);
    await component.onSaved(second);

    expect(counterService.counters()).toEqual([second, first]);
  });
});