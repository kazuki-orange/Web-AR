const checkDeviceOrien = () => {
  return new Promise((resolve, reject) => {
    const button = document.getElementById('btn');
    button.addEventListener('click', () => {
      if (window.DeviceMotionEvent && window.DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission()
                          .then((state) => {
                            if (state === 'granted') {
                              document.getElementById('btn').className = 'hidden';
                              document.getElementById('box').style.zIndex = 0;
                              resolve('resolve');
                            } else {
                              alert('Reboot the device and re-open this page.');
                              reject('resolve');
                            }
                          });
      } else {
        document.getElementById('btn').className = 'hidden';
        document.getElementById('box').style.zIndex = 0;
        resolve('resolve');
      };
    });
  });
};

const unit = () => {
  // AR part
  const w = window.innerWidth;
  const h = window.innerHeight;
  const canvas = document.getElementById('canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 1, 6000);
  scene.add(camera);
  const arjs = new THREEx.LocationBased(scene, camera);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas,
  });
  const cam = new THREEx.WebcamRenderer(renderer);
  const controls = new THREE.DeviceOrientationControls(camera, true);
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);

  const createSprite_red = (texture, scale, t_lng, t_lat) => {
    if (typeof red != 'undefined') {
      scene.remove(red);
      spriteMaterial_red.dispose();
    };
    spriteMaterial_red = new THREE.SpriteMaterial({map: texture});
    red = new THREE.Sprite(spriteMaterial_red);
    red.scale.set(scale.x, scale.y, scale.z);
    red.position.set(0, 0, 0);
    arjs.add(red, t_lng, t_lat);
  };

  const createSprite_green = (texture, scale, t_lng, t_lat) => {
    if (typeof green != 'undefined') {
      scene.remove(green);
      spriteMaterial_green.dispose();
    };
    spriteMaterial_green = new THREE.SpriteMaterial({map: texture});
    green = new THREE.Sprite(spriteMaterial_green);
    green.scale.set(scale.x, scale.y, scale.z);
    green.position.set(0, 0, 0);
    arjs.add(green, t_lng, t_lat);
  };

  const createSprite_blue = (texture, scale, t_lng, t_lat) => {
    if (typeof blue != 'undefined') {
      scene.remove(blue);
      spriteMaterial_blue.dispose();
    };
    spriteMaterial_blue = new THREE.SpriteMaterial({map: texture});
    blue = new THREE.Sprite(spriteMaterial_blue);
    blue.scale.set(scale.x, scale.y, scale.z);
    blue.position.set(0, 0, 0);
    arjs.add(blue, t_lng, t_lat);
  };

  const createSprite_dest = (texture, scale, t_lng, t_lat) => {
    if (typeof spriteMaterial_dest != 'undefined') {
      scene.remove(dest);
      spriteMaterial_dest.dispose();
    };
    spriteMaterial_dest = new THREE.SpriteMaterial({map: texture});
    dest = new THREE.Sprite(spriteMaterial_dest);
    dest.scale.set(scale.x, scale.y, scale.z);
    dest.position.set(0, 0, 0);
    arjs.add(dest, t_lng, t_lat);
  };

  const createCanvasForTexture = (text, color) => {
    const canvasForText = document.createElement('canvas');
    const ctx = canvasForText.getContext('2d');
    const canvasWidth = ctx.canvas.width = 150;
    const canvasHeight = ctx.canvas.height = 150;
    ctx.fillStyle = `rgba(${color}, 0.2)`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = `50px serif`;
    ctx.fillText(
      text,
      (canvasWidth - ctx.measureText(text).width) / 2,
      canvasHeight / 2 + ctx.measureText(text).actualBoundingBoxAscent / 2
    );
    return canvasForText;
  };

  const R = Math.PI / 180;
  const calcuDistance = (f_lng, f_lat, t_lng, t_lat) => {
    const f1 = f_lng * R;
    const f2 = f_lat * R;
    const t1 = t_lng * R;
    const t2 = t_lat * R;

    const _d = 6378140 * Math.acos(Math.cos(t1 - f1) * Math.cos(f2) * Math.cos(t2) + Math.sin(f2) * Math.sin(t2));
    const d = Math.round(_d);
    console.log(d);
    return d;
  };

  const createCanvastexture_red = (text) => {
    if (typeof canvasTexture_red != 'undefined') {
      canvasTexture_red.dispose();
    };
    canvasTexture_red = new THREE.CanvasTexture(
      createCanvasForTexture(text, '255, 0, 0')
    );
    return canvasTexture_red;
  };

  const createCanvastexture_green = (text) => {
    if (typeof canvasTexture_green != 'undefined') {
      canvasTexture_green.dispose();
    };
    canvasTexture_green = new THREE.CanvasTexture(
      createCanvasForTexture(text, '0, 255, 0')
    );
    return canvasTexture_green;
  };

  const createCanvastexture_blue = (text) => {
    if (typeof canvasTexture_blue != 'undefined') {
      canvasTexture_blue.dispose();
    };
    canvasTexture_blue = new THREE.CanvasTexture(
      createCanvasForTexture(text, '0, 0, 255')
    );
    return canvasTexture_blue;
  };

  const createCanvastexture_dest = (text) => {
    if (typeof canvasTexture_dest != 'undefined') {
      canvasTexture_dest.dispose();
    };
    canvasTexture_dest = new THREE.CanvasTexture(
      createCanvasForTexture(text, '239, 28, 225')
    );
    return canvasTexture_dest;
  };

  const setObjectCallback = (f_lng, f_lat, t_lng, t_lat, createSpriteCallback, createCanvastextureCallback) => {
    new Promise((resolve) => {
      resolve(calcuDistance(f_lng, f_lat, t_lng, t_lat));
    })
    .then((num) => {
      if (num >= 15) {
        var scaleMaster = num / 12;
      } else {
        var scaleMaster = 0
      };
      createSpriteCallback(
        createCanvastextureCallback(num),
        {
          x: scaleMaster,
          y: scaleMaster,
          z: scaleMaster,
        },
        t_lng, t_lat   
      );
    });
  };

  const setObject_red = (t_lng, t_lat) => {
    if (typeof watchId_red != 'undefined') {
      navigator.geolocation.clearWatch(watchId_red);
    };
    watchId_red = navigator.geolocation.watchPosition(suc, err, {enableHighAccuracy: true});
    function suc(pos) {
      const f_lng = pos.coords.longitude;
      const f_lat = pos.coords.latitude;
      setObjectCallback(f_lng, f_lat, t_lng, t_lat, createSprite_red, createCanvastexture_red);
    };
  };

  const setObject_green = (t_lng, t_lat) => {
    if (typeof watchId_green != 'undefined') {
      navigator.geolocation.clearWatch(watchId_green);
    };
    watchId_green = navigator.geolocation.watchPosition(suc, err, {enableHighAccuracy: true});
    function suc(pos) {
      const f_lng = pos.coords.longitude;
      const f_lat = pos.coords.latitude;
      setObjectCallback(f_lng, f_lat, t_lng, t_lat, createSprite_green, createCanvastexture_green);
    };
  };

  const setObject_blue = (t_lng, t_lat) => {
    if (typeof watchId_blue != 'undefined') {
      navigator.geolocation.clearWatch(watchId_blue);
    };
    watchId_blue = navigator.geolocation.watchPosition(suc, err, {enableHighAccuracy: true});
    function suc(pos) {
      const f_lng = pos.coords.longitude;
      const f_lat = pos.coords.latitude;
      setObjectCallback(f_lng, f_lat, t_lng, t_lat, createSprite_blue, createCanvastexture_blue);
    };
  };

  const setObject_dest = (t_lng, t_lat) => {
    if (typeof watchId_dest != 'undefined') {
      navigator.geolocation.clearWatch(watchId_dest);
    };
    watchId_dest = navigator.geolocation.watchPosition(suc, err, {enableHighAccuracy: true});
    function suc(pos) {
      const f_lng = pos.coords.longitude;
      const f_lat = pos.coords.latitude;
      setObjectCallback(f_lng, f_lat, t_lng, t_lat, createSprite_dest, createCanvastexture_dest);
    };
  };

  const render = () => {
    renderer.setAnimationLoop(() => {
      cam.update();
      controls.update();
      renderer.render(scene, camera);
    });
  };

  // map part
  mapboxgl.accessToken = 'your access token';
  navigator.geolocation.getCurrentPosition(suc, err, {enableHighAccuracy: true});
  function suc(pos) {
    const lng = pos.coords.longitude;
    const lat = pos.coords.latitude;
    mapView([lng, lat]);
  };

  const mapView = ([lng, lat]) => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 14
    });

    const myMarker = new mapboxgl.Marker({
      color: '#FFF200',
      draggable: false
    }).setLngLat([lng, lat]).addTo(map); 

    navigator.geolocation.watchPosition(suc, err, {enableHighAccuracy: true});
    function suc(pos) {
      const lng = pos.coords.longitude;
      const lat = pos.coords.latitude;
      arjs.fakeGps(lng, lat);
      myMarker.setLngLat([lng, lat]);
    };

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    map.addControl(new mapboxgl.ScaleControl({
      maxWidth: 200,
      unit: 'metric'
    }));
    
    const marker = (color) => {
      const mrk = new mapboxgl.Marker({
        color: color,
        draggable: true
      });
      return mrk;
    };
    const red = marker('#AA0000');
    const green = marker('#00AA00');
    const blue = marker('#0000AA');
    const dest = marker('#EF1CE1');

    const zahyo = [];
    map.on('click', (pos) => {
      const t_lng = pos.lngLat.lng;
      const t_lat = pos.lngLat.lat;

      zahyo.push([t_lng, t_lat]);
      console.log(zahyo);
      const i = zahyo.length;
      console.log(i);
      const num = 3;

      if (i%num === 1) {
        red.setLngLat([t_lng, t_lat]).addTo(map);
        setObject_red(t_lng, t_lat);
      } 
      else if (i%num === 2) {
        green.setLngLat([t_lng, t_lat]).addTo(map);
        setObject_green(t_lng, t_lat);
      }
      else {
        blue.setLngLat([t_lng, t_lat]).addTo(map);
        setObject_blue(t_lng, t_lat);
      };
      render();
    });

    const dropMarker = (marker, setObject) => {
      marker.on('dragend', () => {
        const lng = marker.getLngLat().lng;
        const lat = marker.getLngLat().lat;
        console.log(lng, lat);
        setObject(lng, lat);  
        render();
      });
    };
    dropMarker(red, setObject_red);
    dropMarker(green, setObject_green);
    dropMarker(blue, setObject_blue);
    dropMarker(dest, setObject_dest);

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: false,
      mapboxgl: mapboxgl,
      reverseGeocode: true,
      types: 'address, poi',
      limit: 1,
      collapsed: true
    });
    map.addControl(geocoder);

    geocoder.on('result', (result) => {
      const lnglat = result['result']['geometry']['coordinates'];
      console.log('dest');
      console.log(lnglat)
      dest.setLngLat(lnglat).addTo(map);
      setObject_dest(lnglat[0], lnglat[1]);
      render();
    });
  };

  function err(e) {
    alert(e.message);
  };
};

window.onload = () => {
  checkDeviceOrien()
    .then(() => {
      unit();
    })
    .catch((error) => {
      console.log(error);
    });
};