addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  console.log(request.headers['user-agent'], mm + '/' + dd + '/' + yyyy,pathname.substring(1));

  if (pathname.startsWith("/proxy")) {
    var decoded_string = atob(path);
    return new Response(
      page_308
      );
  };

  return new Response(
    `<!doctype html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <h1 >
        Nothing here :)
      </h1>
    </body>
    </html>`,
      {
        status: 404,
        headers: { 'content-type': 'text/html' },
      },
    )
}