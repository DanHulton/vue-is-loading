# vue-is-loading

A Vue 3 JavaScript port of [vue-loadable](https://github.com/VitorLuizC/vue-loadable).

## Installation

To add this package to your project, run:

`yarn add vue-is-loading`

Or:

`npm install vue-is-loading`

In your Vue setup file, add:

```javascript
import IsLoading from 'vue-is-loading';

// ...

app.use(IsLoading);
````

## Usage

This plugin exposes a global `$isLoading` function that you can check to see if a function that returns a promise has completed.  Combined with a loading-spinner component or the `disabled` property, you can easily indicate to your user that a server-side action is still processing.

### Options API

If you're still using the Vue 2-style options API, you can use the `mapLoadableMethods` helper:

```vue
<template>
  <div>
    <button
      :disabled="$isLoading('signup')"
      @click="submit"
    >
      Sign up
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mapLoadableMethods } from 'vue-is-loading';

export default {
  methods: {
    isEmpty,

    ...mapLoadableMethods(
      mapActions('User', [
        'signup',
      ]),
    ),

    submit() {
      await this.signup();
    },
  },
};
</script>
```

### Composition API

If you're using the new Vue 3-style Composition API, you can use the finer-grained `loadable` helper:

```vue
<template>
  <div>
    <button
      :disabled="$isLoading('signup')"
      @click="submit"
    >
      Sign up
    </button>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { loadable } from 'vue-is-loading';

const store = useStore();

const signup = loadable(
  (values) => store.dispatch('Users/signup', values),
  'signup',
);
const submit = async () => {
  await signup();
};
</script>
```

If you want to use `$isLoading` as part of a `computed()` variable in a Composition API situation:

```javascript
const agreeToTos = ref(false);

const instance = getCurrentInstance();
const submitDisabled = computed(
  () => instance.ctx.$isLoading('signup') || agreeToTos.value === false,
);
```

## Changelog

### 1.0.1

- Fixes `loadable` to work with Vue's Composition API with `<script setup>`.