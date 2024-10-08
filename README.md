![header](https://github.com/user-attachments/assets/1672d691-f618-44c8-b6dd-7c9bcdf0565d)

# boom 💥

> Tools we use to build puzzles.

## Installation

With `npm`

```bash
npm install @immerspiele/boom
```

or with `yarn`

```bash
yarn add @immerspiele/boom
```

## Packages

### Signal

A simple signal implementation.

### Screen

Screen controller. Manage screen transitions and screen states.

#### Setup

```typescript
import { initialize } from '@immerspiele/boom/screen';

// Tell the screen controller which "container" element to render the screens in.
initialize(document.getElementById('screen-container'));
```

#### Usage

```typescript
import { createScreen, onMount, onUnmount } from '@immerspiele/boom/screen';

const screen = createScreen(() => {
  const $ = document.createElement('div');

  onMount(() => {
    // Do something when the screen is mounted.
  });

  onUnmount(() => {
    // Do something right before the screen is unmounted.
  });

  return $;
});
