import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plane, Plus, Link as LinkIcon } from 'lucide-react';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [newTripName, setNewTripName] = useState('');
  const [joinTripId, setJoinTripId] = useState('');

  const fetchTrips = async () => {
    try {
      const res = await axios.get('https://tripledger-gr2n.onrender.com/api/trips');
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!newTripName) return;
    try {
      await axios.post('https://tripledger-gr2n.onrender.com/api/trips', { name: newTripName });
      setNewTripName('');
      fetchTrips();
    } catch (err) {
      alert('Failed to create trip');
    }
  };

  const handleJoinTrip = async (e) => {
    e.preventDefault();
    if (!joinTripId) return;
    try {
      await axios.post('https://tripledger-gr2n.onrender.com/api/trips/join', { tripId: joinTripId });
      setJoinTripId('');
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join trip');
    }
  };

  return (
    <div>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Plane /> My Trips
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {/* Create/Join Section */}
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <form onSubmit={handleCreateTrip}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} /> Create New Trip
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                className="input-field" 
                style={{ marginBottom: 0 }}
                placeholder="E.g., Paris 2026" 
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Create</button>
            </div>
          </form>

          <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0' }} />

          <form onSubmit={handleJoinTrip}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LinkIcon size={20} /> Join Existing Trip
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                className="input-field"
                style={{ marginBottom: 0 }} 
                placeholder="Enter Trip ID" 
                value={joinTripId}
                onChange={(e) => setJoinTripId(e.target.value)}
              />
              <button className="btn btn-secondary" type="submit">Join</button>
            </div>
          </form>

        </div>

        {/* Trips List Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {trips.length === 0 ? (
            <p style={{ color: 'var(--text-light)' }}>You aren't part of any trips yet. Create or join one!</p>
          ) : (
            trips.map(trip => (
              <Link to={`/trip/${trip._id}`} key={trip._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>{trip.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                    {trip.participants.length} Participant{trip.participants.length !== 1 ? 's' : ''} • ID: <span style={{ fontWeight: 'bold' }}>{trip.tripId}</span>
                  </p>
                </div>
                <div className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Open →</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
