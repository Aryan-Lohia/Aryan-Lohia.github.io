'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"404.html": "0a27a4163254fc8fce870c8cc3a3f94f",
"assets/AssetManifest.bin": "7a8f51fc6e784e07610cf9739a81cc13",
"assets/AssetManifest.json": "d019f806a0152bcda4ff907d8e971c57",
"assets/assets/AIPPM%2520Logo%25201.png": "7ec1c8982c07f3d68137dc61c86fda5f",
"assets/assets/AKAM%25201.png": "5e6375e1fb3693a694977fc29acde82a",
"assets/assets/aptiwary.jpg": "89654b2136fc7ce3c51fdea13c019b50",
"assets/assets/bg1.png": "7d5819b8d1cd927bf1328e3f3078f049",
"assets/assets/bg2.png": "1f928ecc268fb15971558c0e48e05426",
"assets/assets/biswapriyo.jpg": "c55d4ae57818960bccd9edbfbd0892b1",
"assets/assets/calendar.png": "ae7fefb7d72baa257625e556484808b1",
"assets/assets/committeebg.png": "fa89fb8b55f932de183e6c14497f82a5",
"assets/assets/download.png": "708bdf3e7478be5de91491828196c328",
"assets/assets/fblogo.png": "22a1dac62d2c389b06aa068c99676f89",
"assets/assets/fonts/Montserrat-Medium.ttf": "b3ba703c591edd4aad57f8f4561a287b",
"assets/assets/fonts/Montserrat-SemiBold.ttf": "fb428a00b04d4e93deb4d7180814848b",
"assets/assets/fonts/Montserrat-VariableFont_wght.ttf": "52a37115b1d8d5d6ae0b0e373e692c9d",
"assets/assets/g20.png": "b64469d7a46e65a7b4df35a483c1110d",
"assets/assets/glass.png": "e1e2d32c29130ab5bd615669a432f5a8",
"assets/assets/icon1.png": "903f7f583722c26430cf48b3b763c088",
"assets/assets/insta.png": "2dd3a2d27c47964b2127245b3b477f14",
"assets/assets/IP%25202.png": "05cb0638d4ca124af2c3a7823193611a",
"assets/assets/left.png": "7293b871aa4a86ce7bc5bac7e7007a0b",
"assets/assets/logo1.png": "04524fbff339ba4900b5330179810a4f",
"assets/assets/LOGOSMITMUN1.png": "ee8457648a27bedf7984589d8fa5c9fc",
"assets/assets/MUN%2520ICON%25205.png": "ba0123ab904c7190eafedbae7f57c79b",
"assets/assets/pfp.png": "002ecc3454418d41f1cff4d65e2377c1",
"assets/assets/right.png": "9aa67999a0413877337642871330c827",
"assets/assets/smitlogo1.png": "c8ea74b9cfedc99fbaa6e7eec0cc80a0",
"assets/assets/smitmunblack.png": "7e59cdc75b7f346643ab222e11a98cd6",
"assets/assets/smitmunicon.png": "c72a4ca53d7ddd408feb0fbf5165ca13",
"assets/assets/smitmunwhite.png": "8f966c0874d012399e28ac0be9696a38",
"assets/assets/summit.png": "8b4428b1c9e344ca6769744cfe0c73d1",
"assets/assets/tmapai.jpg": "62b3be593ec58b2d33e1b1dbea9997c6",
"assets/assets/trifecta.png": "ed45a147addd806118c3120f47acf698",
"assets/assets/UNHRC%25201.png": "a975ff66a85cdacb8f8e09cb7e6feb34",
"assets/assets/Vector.png": "36a9077160beee041f93c7e05dab3c54",
"assets/assets/venue.png": "9e7e62584d2b28c843a007b4efd3d91c",
"assets/FontManifest.json": "c8ad1119f703c3b48f4d81d06a5f5616",
"assets/fonts/MaterialIcons-Regular.otf": "0042287e1e51a358ecdd40c13ae31437",
"assets/NOTICES": "feb6a491dcb8295eb2c9e137cc497683",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/packages/flutter_map/lib/assets/flutter_map_logo.png": "208d63cc917af9713fc9572bd5c09362",
"assets/packages/window_manager/images/ic_chrome_close.png": "75f4b8ab3608a05461a31fc18d6b47c2",
"assets/packages/window_manager/images/ic_chrome_maximize.png": "af7499d7657c8b69d23b85156b60298c",
"assets/packages/window_manager/images/ic_chrome_minimize.png": "4282cd84cb36edf2efb950ad9269ca62",
"assets/packages/window_manager/images/ic_chrome_unmaximize.png": "4a90c1909cb74e8f0d35794e2f61d8bf",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "c8b0444b22b9810d3d890765bf8adb25",
"/": "c8b0444b22b9810d3d890765bf8adb25",
"main.dart.js": "f804753f321ee276eb8ea651ec9148d9",
"manifest.json": "38b140ef7fe68531763cf06c93f69b0b",
"version.json": "b45398be9fb180283197525ef9651385"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
