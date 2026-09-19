var APP_DATA = {
  "scenes": [
    {
      "id": "0-fachada",
      "name": "Fachada",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1024,
      "initialViewParameters": {
        "yaw": 0,
        "pitch": 0,
        "fov": 1.3365071038314758
      },
      "linkHotspots": [
        {
          "yaw": 0.19938836893234146,
          "pitch": 0.3486404151798794,
          "rotation": 0,
          "target": "1-mesas-externa"
        }
      ],
      "infoHotspots": []
    },
    {
      "id": "1-mesas-externa",
      "name": "Mesas Externa",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1024,
      "initialViewParameters": {
        "yaw": 0.20428777028044287,
        "pitch": 0.007837566433835264,
        "fov": 1.3365071038314758
      },
      "linkHotspots": [
        {
          "yaw": 0.20980509589065122,
          "pitch": 0.4403116618217098,
          "rotation": 0,
          "target": "2-interior-do-caf"
        },
        {
          "yaw": -2.6869478105908833,
          "pitch": 0.30300321268481945,
          "rotation": 0,
          "target": "0-fachada",
          "targetViewParameters": {
            "yaw":  -2.9076,
            "pitch": 0.007837566433835264,
            "fov": 1.3365071038314758
          }
    }
      ],
      "infoHotspots": []
    },
    {
      "id": "2-interior-do-caf",
      "name": "Interior do Café",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        }
      ],
      "faceSize": 1024,
      "initialViewParameters": {
        "yaw": -0.06921219353997365,
        "pitch": -0.0031096698168937564,
        "fov": 1.3365071038314758
      },
      "linkHotspots": [
        {
          "yaw": 3.0312119013045287,
          "pitch": 0.558212523508546,
          "rotation": 0,
          "target": "1-mesas-externa",
          "targetViewParameters": {
            "yaw":  -2.9076,
            "pitch": 0.007837566433835264,
            "fov": 1.3365071038314758
          }
        }
      ],
      "infoHotspots": []
    }
  ],
  "name": "Tour Virtual Café Anis",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": false,
    "viewControlButtons": false
  }
};
