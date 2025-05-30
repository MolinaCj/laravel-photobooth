<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PhotoBooth</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    <style>body { margin: 0; }</style>
</head>
<body>
    <div id="root"></div>

    <script src="https://unpkg.com/bubbly-bg@1.0.0/dist/bubbly-bg.min.js"></script>
    <script>
      window.onload = function() {
        bubbly({
          colorStart: "#fff4e6",
          colorStop: "#ffe9e3",
          bubbleFunc: () => `hsla(${Math.random() * 50}, 100%, 50%, .3)`
        });
      };
    </script>
</body>
</html>
