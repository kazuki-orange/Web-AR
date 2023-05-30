const checkDeviceOrien = () => {
  return new Promise((resolve, reject) => {
    const button = document.getElementById('btn');
    button.addEventListener('click', () => {
      if (window.DeviceMotionEvent && window.DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission()
                          .then((state) => {
                            if (state === 'granted') {
                              document.getElementById('btn').className = 'hidden';
                              document.getElementById('slider').className = 'slider';
                              resolve('resolve');
                            } else {
                              alert('Reboot your device and reload the app.');
                              reject('resolve');
                            }
                          });
      } else {
        document.getElementById('btn').className = 'hidden';
        document.getElementById('slider').className = 'slider';
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

  const light = new THREE.DirectionalLight(0xFFFFFF);
  light.intensity = 2;
  light.position.set(0, 1, 0);
  scene.add(light);

  const createObject = (color, geometry) => {
    const material = new THREE.MeshStandardMaterial({
      color: color,
      opacity: 0.4,
      transparent: true,
      side: THREE.DoubleSide
    });
    const object = new THREE.Mesh(geometry, material);
    return object;
  };

  let object_red;
  let object_green;
  let object_blue;
  let object_dest;

  const createObject_red = (val) => {
    const geometry_red = new THREE.SphereGeometry(val);
    object_red = createObject('#AA0000', geometry_red);
    return object_red;
  };
  const createObject_green = (val) => {
    const geometry_green = new THREE.SphereGeometry(val);
    object_green = createObject('#00AA00', geometry_green);
    return object_green;
  };
  const createObject_blue = (val) => {
    const geometry_blue = new THREE.SphereGeometry(val);
    object_blue = createObject('#0000AA', geometry_blue);
    return object_blue;
  };
  const createObject_dest = (val) => {  
    const geometry_dest = new THREE.SphereGeometry(val);
    const material_dest = new THREE.MeshNormalMaterial();
    object_dest = new THREE.Mesh(geometry_dest, material_dest);
    return object_dest;
  };

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

  const render = () => {
    renderer.setAnimationLoop(() => {
      cam.update();
      controls.update();
      renderer.render(scene, camera);
    });
  };

  // map part
  mapboxgl.accessToken = 'pk.eyJ1Ijoia2F6dWtpLW9yYW5nZSIsImEiOiJjbDJkZXJoZmcwcTNmM2NrcTZ5NHA1NjFkIn0.BMSxixgiTOB-d2MZPTeMOw';
  navigator.geolocation.getCurrentPosition(suc, err, {enableHighAccuracy: true});
  function suc(pos) {
    const lng = pos.coords.longitude;
    const lat = pos.coords.latitude;
    mapView(lng, lat);
  };

  const mapView = (lng, lat) => {
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
      myMarker.setLngLat([lng, lat]);
      arjs.fakeGps(lng, lat);
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
    const dest = marker('#FDA0FF');

    const slider = document.getElementById('slider');
    const setObject_red = (lng, lat) => {
      scene.remove(object_red);
      red.setLngLat([lng, lat]).addTo(map);
      const initialVal = slider.value;
      arjs.add(createObject_red(initialVal), lng, lat);

      slider.addEventListener('input', () => {
        scene.remove(object_red);
        const val = slider.value;      
        arjs.add(createObject_red(val), lng, lat);
      });
    };
    const setObject_green = (lng, lat) => {
      scene.remove(object_green);
      green.setLngLat([lng, lat]).addTo(map);
      const initialVal = slider.value;
      arjs.add(createObject_green(initialVal), lng, lat);

      slider.addEventListener('input', () => {
        scene.remove(object_green);
        const val = slider.value;      
        arjs.add(createObject_green(val), lng, lat);
      });
    };
    const setObject_blue = (lng, lat) => {
      scene.remove(object_blue);
      blue.setLngLat([lng, lat]).addTo(map);
      const initialVal = slider.value;
      arjs.add(createObject_blue(initialVal), lng, lat);

      slider.addEventListener('input', () => {
        scene.remove(object_blue);
        const val = slider.value;      
        arjs.add(createObject_blue(val), lng, lat);
      });
    };
    const setObject_dest = (lng, lat) => {
      scene.remove(object_dest);
      const initialVal = slider.value;
      dest.setLngLat([lng, lat]).addTo(map);
      arjs.add(createObject_dest(initialVal), lng, lat);

      slider.addEventListener('input', () => {
        scene.remove(object_dest);
        const val = slider.value;      
        arjs.add(createObject_dest(val), lng, lat);
      });
    };

    const zahyo = [];
    map.on('click', (pos) => {
      const lng = pos.lngLat.lng;
      const lat = pos.lngLat.lat;

      zahyo.push([lng, lat]);
      console.log(zahyo);
      const c = zahyo.length;
      console.log(c);
      const num = 3;

      if (c%num === 1) {
        setObject_red(lng, lat);
      }
      else if (c%num === 2) {
        setObject_green(lng, lat);
      }
      else {
        setObject_blue(lng, lat);
      };
      render();
    });

    red.on('dragend', () => {
      const lnglat = red.getLngLat();
      const lng = lnglat.lng;
      const lat = lnglat.lat;
      setObject_red(lng, lat);
      render();
    });
    green.on('dragend', () => {
      const lnglat = green.getLngLat();
      const lng = lnglat.lng;
      const lat = lnglat.lat;
      setObject_green(lng, lat);
      render();
    });
    blue.on('dragend', () => {
      const lnglat = blue.getLngLat();
      const lng = lnglat.lng;
      const lat = lnglat.lat;
      setObject_blue(lng, lat);
      render();
    });
    dest.on('dragend', () => {
      const lnglat = dest.getLngLat();
      const lng = lnglat.lng;
      const lat = lnglat.lat;
      setObject_dest(lng, lat);
      render();
    });

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