import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [results, setResults] = useState([]);
  const [newCar, setNewCar] = useState('');
  const [newTrack, setNewTrack] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleLogin = () => {
    if (login === process.env.NEXT_PUBLIC_LOGIN && password === process.env.NEXT_PUBLIC_PASSWORD) {
      setLoggedIn(true);
      fetchResults();
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const fetchResults = async () => {
    const { data } = await supabase.from('race_results').select('*');
    setResults(data);
  };

  const addResult = async () => {
    if (!newCar || !newTrack || !newTime) return alert("Заполните все поля");
    await supabase.from('race_results').insert([{ track: newTrack, car: newCar, time: newTime }]);
    fetchResults();
    setNewCar('');
    setNewTrack('');
    setNewTime('');
  };

  if (!loggedIn) {
    return (
      <div style={{padding:20}}>
        <h1>Login</h1>
        <input placeholder="Login" value={login} onChange={e => setLogin(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Enter</button>
      </div>
    );
  }

  return (
    <div style={{padding:20}}>
      <h1>Race Results</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Track</th>
            <th>Car</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.id}>
              <td>{r.track}</td>
              <td>{r.car}</td>
              <td>{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add Result</h2>
      <input placeholder="Track" value={newTrack} onChange={e => setNewTrack(e.target.value)} />
      <input placeholder="Car" value={newCar} onChange={e => setNewCar(e.target.value)} />
      <input placeholder="Time" value={newTime} onChange={e => setNewTime(e.target.value)} />
      <button onClick={addResult}>Add</button>
    </div>
  );
}
