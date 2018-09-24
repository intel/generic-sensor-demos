export const idleUntilVisible = (target, fn) => {
  let requestId = -1;
  const observer = new IntersectionObserver((entries, observer) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      if (requestId > 0) {
        cancelIdleCallback(requestId);
      }
      observer.unobserve(target);
      fn();
    }
  });
  observer.observe(target);
  requestId = requestIdleCallback(() => {
    observer.unobserve(target);
    fn();
  });
};