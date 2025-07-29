import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { useEffect } from 'react';

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    const heat = L.heatLayer(points, {
      radius: 60,
      blur: 35,
      maxZoom: 17,
      minOpacity: 0.5,
      gradient: {
        0.2: 'blue',
        0.4: 'lime',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red',
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};
export default HeatmapLayer;
