import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from './counter.service';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('CounterService', () => {
  let service: CounterService;

  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);
  const removeMock = vi.mocked(Preferences.remove);

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

  beforeEach(() => {
    // Vynulujeme počty volání mocků z předchozího testu.
    vi.clearAllMocks();

    // Výchozí stav: v Preferences zatím není uložená historie.
    getMock.mockResolvedValue({ value: null });

    // Zápis i odstranění ve výchozím stavu úspěšně skončí.
    setMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);

    // Pro každý test vytvoříme nové prostředí Angular dependency injection.
    TestBed.configureTestingModule({
      providers: [CounterService],
    });

    // Z testovacího injectoru získáme čerstvou instanci služby.
    service = TestBed.inject(CounterService);
  });

  it('should initialize only once', async () => {
    // Dvě volání bez čekání simulují souběžné požadavky na inicializaci.
    await Promise.all([service.initialize(), service.initialize()]);

    // Další volání proběhne až po dokončení první inicializace.
    await service.initialize();

    // Všechna volání musí sdílet jedinou operaci načtení Preferences.
    expect(getMock).toHaveBeenCalledTimes(1);

    // Služba dokončila inicializaci a při value: null má prázdnou historii.
    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
  });

  // TODO: samostatně doplňte testy scénářů 1–5 ze zadání.
  it('should load saved data', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([first, second]) });
    await service.initialize();
    expect(service.counters()).toEqual([first, second]);
    expect(getMock).toHaveBeenCalledWith({key: 'saved-counters'});
  });

  it('should save new counter', async () => {
    await service.add(first);
    await service.add(second);
    expect(service.counters()).toEqual([second, first]);
    expect(setMock).toHaveBeenCalledWith({key: 'saved-counters', value: JSON.stringify([second, first])});
    expect(setMock).toHaveBeenCalledTimes(2);
  });

  it('should remove one specific counter', async () => {
    await service.add(first);
    await service.add(second);
    expect(service.counters()).toEqual([second, first]);
    expect(setMock).toHaveBeenCalledWith({key: 'saved-counters', value: JSON.stringify([second, first])});
    await service.remove(first.id);
    expect(service.counters()).toEqual([second]);
    expect(setMock).toHaveBeenCalledWith({key: 'saved-counters', value: JSON.stringify([second])});
  });

  it('should remove all counters', async () => {
    await service.add(first);
    await service.add(second);
    expect(service.counters()).toEqual([second, first]);
    expect(setMock).toHaveBeenCalledWith({key: 'saved-counters', value: JSON.stringify([second, first])});
    expect(setMock).toHaveBeenCalledTimes(2);
    await service.clear();
    expect(service.counters()).toEqual([]);
    expect(removeMock).toHaveBeenCalledWith({key: 'saved-counters'});
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(setMock).toHaveBeenCalledTimes(2);
  });

  it('should handle invalid JSON', async () => {
    getMock.mockResolvedValue({
      value: 'this is not valid JSON'
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await service.initialize();
    expect(service.counters()).toEqual([]);
    expect(service.initialized()).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith('Failed to load the history of counters.');
    errorSpy.mockRestore();
  });

  it('should handle JSON parse errors', async () => {
    getMock.mockResolvedValue({
      value: JSON.stringify({name: 'test'})
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await service.initialize();
    expect(service.counters()).toEqual([]);
    expect(service.initialized()).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith('Failed to load the history of counters.', expect.any(Error));
    errorSpy.mockRestore();
  });
});