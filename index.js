var validator = require('validator');

let options = {
  protocols: [
      'http',
      'https',
  ],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: true,
  host_whitelist: false,
  host_blacklist: false,
  allow_trailing_dot: true,
  allow_protocol_relative_urls: false,
  disallow_auth: false
};

addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

function return404(msg = "Nothing here :)"){
  return new Response(
    `<!doctype html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <h1 >`+
      msg+
      `</h1>
    </body>
    </html>`,
      {
        status: 404,
        headers: { 
          'content-type': 'text/html',
          'Cache-Control': 'max-age=1500'
        },
      },
    )
};

async function handleRequest(request) {
  const url = new URL(request.url);

  console.log(request.headers.get('user-agent'), new Date().toLocaleDateString(), url.pathname.substring(1));

  if (url.pathname.startsWith("/proxy")) {
    if (!url.searchParams.get('url')){
      return return404();
    }
    var decoded_string = atob(url.searchParams.get('url'));
    if (!validator.isURL(decoded_string, options)){
      return return404('Not a valid URL');
    }
    
    response = await fetch(decoded_string, {
      cf: {
        cacheTtl: 5,
        cacheEverything: true,
        webp: true,
        avif: true,
        scrapeShield: true,
        polish: 'lossy',
        minify: {'images': true,'video': true,'css': true,'html': true,'javascript': true, 'audio': true},

      },
    })
    if (response.ok || response.redirected) {
      var content_type = response.headers.get('content-type').toLowerCase();
      console.log(content_type , 'Proxy', new Date().toLocaleDateString());

      if (content_type.includes('image') || content_type.includes('video') || content_type.includes('audio')){
        response = new Response(response.body, response);
        response.headers.set('Cache-Control', 'max-age=1500');
        return response;
    }}};
  return return404();
}