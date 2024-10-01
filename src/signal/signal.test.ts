import { test, expect, vi } from 'vitest';
import createSignal from '.';

test('signal with arguments', () => {
  const [subscribe, dispatch] = createSignal<[name: string, age: number]>();

  const handler = vi.fn();
  const dispose = subscribe(handler);

  dispatch('John', 25);
  dispose();
  dispatch('Jane', 30);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith('John', 25);
});

test('signal without arguments', () => {
  const [subscribe, dispatch] = createSignal();

  const handler = vi.fn();
  const dispose = subscribe(handler);

  dispatch();
  dispose();
  dispatch();

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith();
});

test('dispose all handlers', () => {
  const [subscribe, dispatch, disposeAll] = createSignal<[name: string]>();

  const handler1 = vi.fn();
  const handler2 = vi.fn();
  const handler3 = vi.fn();

  subscribe(handler1);
  subscribe(handler2);
  subscribe(handler3);

  dispatch('John');
  disposeAll();
  dispatch('Jane');

  expect(handler1).toHaveBeenCalledTimes(1);
  expect(handler2).toHaveBeenCalledTimes(1);
  expect(handler3).toHaveBeenCalledTimes(1);
});

test('dispose specific handler', () => {
  const [subscribe, dispatch, unsubscribe] = createSignal<[name: string]>();

  const handler1 = vi.fn();
  const handler2 = vi.fn();
  const handler3 = vi.fn();

  subscribe(handler1);
  subscribe(handler2);
  subscribe(handler3);

  dispatch('John');
  unsubscribe(handler2);
  dispatch('Jane');

  expect(handler1).toHaveBeenCalledTimes(2);
  expect(handler2).toHaveBeenCalledTimes(1);
  expect(handler3).toHaveBeenCalledTimes(2);
});

test('dispose handler from subscribe return value', () => {
  const [subscribe, dispatch] = createSignal<[name: string]>();

  const handler = vi.fn();
  const dispose = subscribe(handler);

  dispatch('John');
  dispose();
  dispatch('Jane');

  expect(handler).toHaveBeenCalledTimes(1);
});
