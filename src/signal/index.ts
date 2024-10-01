export type SignalArguments = any[];
export type SignalCallback<Arguments extends SignalArguments> = (...args: Arguments) => void;
export type SignalDisposer = () => void;
export type SignalUnsubscriber = (callback: SignalCallback<any>) => void;
export type SignalSubscriber<Arguments extends SignalArguments> = (
  callback: SignalCallback<Arguments>,
) => SignalDisposer;
export type SignalDispatcher<Arguments extends SignalArguments> = (...args: Arguments) => void;
export type Signal<Arguments extends SignalArguments> = [
  SignalSubscriber<Arguments>,
  SignalDispatcher<Arguments>,
  SignalUnsubscriber,
];

const createSignal = <Arguments extends SignalArguments>() => {
  const subscribers = [] as SignalCallback<Arguments>[];

  const unsubscribe = (callback?: SignalCallback<Arguments>) => {
    // Remove all subscribers if no callback function is provided
    if (!callback) {
      subscribers.length = 0;
      return;
    }

    // Remove the provided callback function from the subscribers list
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  }

  const subscribe: SignalSubscriber<Arguments> = (callback) => {
    subscribers.push(callback);

    return unsubscribe.bind(null, callback);
  };

  const dispatch: SignalDispatcher<Arguments> = (...args) => {
    for (const subscriber of subscribers) {
      subscriber(...args);
    }
  };

  return [
    subscribe,
    dispatch,
    unsubscribe,
  ] as Signal<Arguments>;
};

export default createSignal;
