/**
 * Call function and execute its hooks. Executes `onDone` when its done and
 * `onError` when it throws an error.
 *
 * @param {Function} call - The function to call.
 * @param {Function} onDone - The hook to execute when done.
 * @param {Function} onError - The hook to execute when error.  If absent, call onDone instead.
 */
const callWithHooks = (call, onDone, onError) => {
  const handleError = (error) => {
    onError ? onError() : onDone();

    return Promise.reject(error);
  };

  try {
    return Promise.resolve(call())
      .then((value) => {
        onDone();
        return Promise.resolve(value);
      })
      .catch(handleError);
  } catch (error) {
    return handleError(error);
  }
};

export default callWithHooks;
