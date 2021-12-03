import { getCurrentInstance } from 'vue';
import { get } from 'lodash';
import callWithHooks from './callWithHooks';

/**
 * A mixin which adds loading states and helpers to Vue components.
 */
const LoadableMixin = {
  data() {
    return {
      LOADING_STATES: {},
    };
  },
  methods: {
    $isLoading(state = 'unknown') {
      const value = this.LOADING_STATES[state];
      return !!value && value > 0;
    },

    $isLoadingAny() {
      return Object.keys(this.LOADING_STATES).some(this.$isLoading);
    },

    $setLoading(state = 'unknown') {
      const value = this.LOADING_STATES[state];
      this.$set(this.LOADING_STATES, state, value ? value + 1 : 1);
    },

    $unsetLoading(state = 'unknown') {
      const value = this.LOADING_STATES[state];
      this.$set(this.LOADING_STATES, state, value ? value - 1 : 0);
    },
  },
};

/**
 * Decorate a method to causes loading states changes during its execution. It
 * sets state as loading when function is init and unsets on throws an error or
 * resolve/return.
 *
 * @param {Function} method - The method to wrap.
 * @param {string} state - The loading state name.  "unknown" if not defined.
 */
export const loadable = (method, state = 'unknown') => {
  const instance = getCurrentInstance();

  return function() {
    const methods = get(instance, 'ctx', this);
    const context = get(instance, 'appContext.config.globalProperties', this);

    methods.$setLoading(state);

    return callWithHooks(
      () => method.apply(context, arguments),
      () => methods.$unsetLoading(state),
    );
  };
};

export const mapLoadableMethods = (methods) => {
  const names = Object.keys(methods);

  return names.reduce(
    (loadableMethods, name) => {
      loadableMethods[name] = loadable(methods[name], name);
      return loadableMethods;
    },
    {},
  );
};

/**
 * Install the plugin.
 *
 * @param {Vue} app - The Vue app to install into.
 */
const install = (app) => {
  app.mixin(LoadableMixin);
};

export default install;
