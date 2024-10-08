export type ScreenID = string | number | Array<any>;
export type Callback = () => void;
export type OnMountCallback = () => Callback | void;
export type MountCallback = Callback;
export type Screen = [
  screenElement: HTMLElement,
  callbacks: [
    onMount: OnMountCallback[],
    onUnmount: MountCallback[],
  ],
];
export type ScreenBuilderFunction = () => HTMLElement;
export type TransitionFunction = (
  screenElement: HTMLElement,
  onComplete?: Callback,
) => void;
export type Transition = [
  enter?: TransitionFunction | null | undefined,
  exit?: TransitionFunction | null | undefined,
]

type ScreenBuilderContext = [
  onMount: OnMountCallback[],
  onUnmount: MountCallback[],
];

// Current screen builder context
let currentScreenBuilderContext: ScreenBuilderContext | null = null;

// Element that contains the screen
let screenContainer: HTMLElement | null = null;

// Current screen id
let currentScreenId: ScreenID | null = null;

// Current mounted screen
let currentScreen: Screen | null = null;

const exitScreen = (
  screen: Screen,
  onExit: Callback,
  transitionFunction?: TransitionFunction | null,
) => {
  const callbacks = screen[1];
  const onUnmount = callbacks[1];

  for (const callback of onUnmount) {
    callback();
  }

  if (transitionFunction) {
    transitionFunction(screen[0], () => {
      screen[0].remove();
      onExit();
    });
  } else {
    screen[0].remove();
    onExit();
  }
};

const enterScreen = (
  screenId: ScreenID,
  screen: Screen,
  transitionFunction?: TransitionFunction | null,
) => {
  const $screen = screen[0];
  const callbacks = screen[1];
  const onMount = callbacks[0];

  screenContainer!.appendChild($screen);

  for (const onMountCallback of onMount) {
    const onUnmountCallback = onMountCallback();

    if (onUnmountCallback) {
      screen[1][1].push(onUnmountCallback);
    }
  }

  if (transitionFunction) {
    transitionFunction($screen);
  }

  currentScreenId = screenId;
  currentScreen = screen;
};

// Initialize screen controller
export const initialize = (container: HTMLElement) => {
  screenContainer = container;
  currentScreenBuilderContext = null;
  currentScreenId = null;
  currentScreen = null;
};

export const onMount = (callback: OnMountCallback) => {
  currentScreenBuilderContext![0].push(callback);
};

export const onUnmount = (callback: MountCallback) => {
  currentScreenBuilderContext![1].push(callback);
};

export const createScreen = (builderFunction: ScreenBuilderFunction): Screen => {
  // Save "current" builder context in order to restore it later
  const previousScreenBuilderContext = currentScreenBuilderContext;

  // Create new builder context
  currentScreenBuilderContext = [
    [], // onMountCallbacks
    [], // onUnmountCallbacks
  ];

  // Execute builder function
  const screenElement = builderFunction();

  // Build screen
  const screen: Screen = [screenElement, currentScreenBuilderContext];

  // Restore previous builder context
  currentScreenBuilderContext = previousScreenBuilderContext;

  return screen;
};

export const setScreen = (
  screenId: ScreenID,
  screen: Screen,
  transition?: Transition,
) => {
  if (screenId === currentScreenId) {
    return;
  }

  let enterTransition: undefined | null | TransitionFunction;
  let exitTransition: undefined | null | TransitionFunction;

  if (transition) {
    enterTransition = transition[0];
    exitTransition = transition[1];
  }

  const presentScreen = () => {
    enterScreen(screenId, screen, enterTransition);
  };

  return currentScreen
    ? exitScreen(currentScreen, presentScreen, exitTransition)
    : presentScreen();
};

const opacity = (
  element: HTMLElement,
  from: number,
  to: number,
  duration: number = 300,
  onComplete?: Callback
) => {
  element.style.opacity = from.toString();
  element.style.transition = `opacity ${duration}ms`;

  const handleTransitionEnd = () => {
    element.removeEventListener('transitionend', handleTransitionEnd);
    element.style.transition = '';
    element.style.opacity = '';

    if (onComplete) {
      onComplete();
    }
  };

  element.addEventListener('transitionend', handleTransitionEnd);

  // Trigger the transition with reflow
  element.offsetHeight;
  element.style.opacity = to.toString();
};

export const fadeIn = (duration?: number): Transition => {
  return [
    (screen: HTMLElement, onComplete?: Callback) => {
      opacity(screen, 0, 1, duration, onComplete);
    },
  ];
};

export const fadeOut = (
  duration?: number
): Transition => {
  return [
    undefined,
    (screen: HTMLElement, onComplete?: Callback) => {
      opacity(screen, 0, 1, duration, onComplete);
    },
  ];
};

export const fadeInOut = (
  duration?: number,
): Transition => {
  return [
    (screen: HTMLElement, onComplete?: Callback) => {
      opacity(screen, 0, 1, duration, onComplete);
    },
    (screen: HTMLElement, onComplete?: Callback) => {
      opacity(screen, 1, 0, duration, onComplete);
    },
  ];
};
