import { expect, it, vi } from 'vitest';
import { initialize, createScreen, onMount, onUnmount, setScreen } from '.';

it('should render the screen element to the container', () => {
  const screenElement = document.createElement('div');
  const container = document.createElement('div');

  initialize(container);

  const screen = createScreen(() => screenElement);
  setScreen('home', screen);

  expect(container.children).toContain(screenElement);
});

it('should call onMount callbacks after the screen is mounted', () => {
  const callback = vi.fn();
  const container = document.createElement('div');

  initialize(container);

  const screen = createScreen(() => {
    const element = document.createElement('div');

    onMount(() => {
      // Test if the element is in the container on mount
      callback([...container.childNodes].includes(element));
    });

    return element;
  });

  setScreen('home', screen);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(true);
});

it('should remove the screen element from the container after the screen is unmounted', () => {
  const screenElement1 = document.createElement('div');
  const screenElement2 = document.createElement('div');
  const container = document.createElement('div');

  initialize(container);

  const screen1 = createScreen(() => screenElement1);
  const screen2 = createScreen(() => screenElement2);

  setScreen('home', screen1);
  expect(container.children).toContain(screenElement1);

  setScreen('about', screen2);
  expect(container.children).not.toContain(screenElement1);
});

it('should call onUnmount callbacks before the screen is unmounted', () => {
  const callback = vi.fn();
  const container = document.createElement('div');

  initialize(container);

  const screen = createScreen(() => {
    const element = document.createElement('div');

    onUnmount(() => {
      // Test if the element is in the container on unmount
      callback([...container.childNodes].includes(element));
    });

    return element;
  });

  setScreen('home', screen);
  setScreen('about', screen);

  expect(callback).toHaveBeenCalledTimes(1);
});
