var validator = require('validator');

let options_validator = {
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

let cf_header = {
    cacheTtl: 5,
    cacheEverything: true,
    webp: true,
    avif: true,
    scrapeShield: true,
    polish: 'lossy',
    minify: {'images': true,'video': true,'css': true,'html': true,'javascript': true, 'audio': true},
}

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
    if (!validator.isURL(decoded_string, options_validator)){
      return return404('Not a valid URL');
    }
    
    response = await fetch(decoded_string, cf_header)
    if (response.ok || response.redirected) {
      var content_type = response.headers.get('content-type').toLowerCase();
      console.log(content_type , 'Proxy', new Date().toLocaleDateString());

      if (content_type.includes('image') || content_type.includes('video') || content_type.includes('audio')){
        last_response = new Response(response.body, response);
        last_response.headers.set('Cache-Control', 'max-age=2000');
        last_response.headers.set('cf', cf_header);

        if (content_type.includes('image')){
          let options = { }
          if (url.searchParams.has('fit')) options.fit = url.searchParams.get('fit')
          if (url.searchParams.has("width")) options.width = url.searchParams.get("width")
          if (url.searchParams.has("height")) options.height = url.searchParams.get("height")
          if (url.searchParams.has("quality")) options.quality = url.searchParams.get("quality")

          const accept = request.headers.get("Accept");
          if (/image\/avif/.test(accept)) {
            options.format = 'avif';
          } else if (/image\/webp/.test(accept)) {
            options.format = 'webp';
          }
          var image_cf_header = cf_header
          image_cf_header.image = options
          last_response.headers.set('cf', image_cf_header);
        }
        return last_response;
    }}};
  return return404();
}