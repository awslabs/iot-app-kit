# Animation development practices

## Throttling JavaScript animations

JavaScript animations are heavily utilized when building interaction experiences, such as dragging and resizing widgets 
on the IoT App Kit dashboard. It is important to throttle the events to reduce the chance of animation jank (caused by 
long-running JavaScript tasks) exceeding the time allotted between animation frames.

Using `requestAnimationFrame`, we ensure JavaScript is throttled to match the refresh rate of the display, which is 
commonly 60 Hz. A 60 Hz refresh rate translates to a targeted 60 frames per second (fps). At 60 fps, we have 16.7 ms to
run all JavaScript associated with the animation, as well as the style recalculation, reflow, and repaint steps of the 
Critical Render Path (CRP). Without throttling the animation using `requestAnimationFrame`, it is possible the CRP will 
be triggered at a much faster rate than 16.7 ms, making it difficult to execute all of the animating JavaScript within 
the animation frame, leading to jank and a degradation in frame rate.

JavaScript animation code should be executed within the callback of `requestAnimationFrame`, for example:

```ts
element.addEventListener('pointermove', (event) => {
  requestAnimationFrame(() => {
    // animation code executes
  });
});
```

It is possible that a user's display refresh rate exceeds 60Hz. Since `requestAnimationFrame` attempts to throttle an 
animation to match the display refresh rate, a 120 Hz refresh rate will lead to the browser attempting to execute an 
animation at 120 fps, allowing only 8.3ms to execute the JavaScript and complete the CRP. There is little benefit to 
exceeding 60 fps and we're much more likely to introduce jank as there is little time to execute the JavaScript. 
Therefore, it is critical to manually throttle the rate at which `requestAnimationFrame` runs down to 60fps to ensure 
maximum rendering performance and maximum JavaScript execution time.

Throttling `requestAnimationFrame` down to 60 fps is accomplished with the following example by preventing execution of 
the animating JavaScript code until 16.7 ms has passed. This will effectively throttle the animation down to 60 fps.

```ts
function move() {
  let msPrev = window.performance.now();
  const FPS = 60;
  const MS_PER_FRAME = 1000 / FPS;

   requestAnimationFrame(() => {
    const msNow = window.performance.now();
    const msPassed = msNow - msPrev;
    
    if (msPassed < MS_PER_FRAME) {
      return;
    }
    
    const excessTime = msPassed % msPerFrame;
    msPrev = msNow - excessTime;
    
    // animation code executes
  });
}
```
