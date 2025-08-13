import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [tracks, setTracks] = useState([
    'Buenos Aires - La Boca',
    'Buenos Aires - Water Run',
    'Himalayas - Leap of Faith',
    'Himalayas - Freefall',
    'Greenland - Out of the Center',
    'Greenland - Ice Breakers',
    'Cairo - A Kings Revival',
    'Cairo - Gezira Island',
    'The Caribbean - Hell Vale',
    'The Caribbean - Island Tour',
    'The Caribbean - Resort Dash',
    'Nevada - Bridge To Bridge',
    'Nevada - Sprint Finish',
    'Norway - Beyond Boundaries',
    'Norway - Future Hymn',
    'New York - Wall Street Ride',
    'Auckland - Sprint Finish',
    'Auckland - Straight Sprint',
    'Osaka - Meiji Rush',
    'Osaka - Namba Park',
    'Paris - Along the Seine',
    'Paris - Notre Dame',
    'Rome - Roman Tumble',
    'Rome - Roman Byroads',
    'San Francisco - Railroad Bustle',
    'San Francisco - The Tunnel',
    'Singapore - Wave Rider',
    'Singapore - Urban Rush',
    'US Midwest - Whirlwind Curve',
    'US Midwest - Trainspotter',
    'Tuscany - Vineyard Townscape',
    'Tuscany - Riverine Launch',
    'Shanghai - Paris of the East',
    'Shanghai - Double Roundabout',
    'Scotland - Rocky Valley',
    'Scotland - Ghost Ships',
  ]);

  const [newCar, setNewCar] = useState('');
  const [times, setTimes] = useState({});

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    let { data } = await supabase.from('Gauntlet').select('car').order('car');
    setCars(data?.map(d => d.car) || []);
  }

  async function addCar() {
    if (!newCar) return;
    await supabase.from('Gauntlet').insert([{ car: newCar }]);
    setCars([...cars, newCar]);
    setNewCar('');
  }

  async function saveTime(car, track, value) {
    await supabase.from('Gauntlet').upsert({ car, track, time: value });
    setTimes({ ...times, [`${car}-${track}`]: value });
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gauntlet</h1>
      <div>
        <input
          placeholder="Новая машина"
          value={newCar}
          onChange={(e) => setNewCar(e.target.value)}
        />
        <button onClick={addCar}>Добавить машину</button>
      </div>
      <table border="1" cellPadding="5" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Машины / Трассы</th>
            {tracks.map(track => <th key={track}>{track}</th>)}
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car}>
              <td>{car}</td>
              {tracks.map(track => (
                <td key={track}>
                  <input
                    style={{ width: '60px' }}
                    value={times[`${car}-${track}`] || ''}
                    onChange={e => saveTime(car, track, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
