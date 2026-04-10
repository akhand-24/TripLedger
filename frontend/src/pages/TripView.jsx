import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { IndianRupee, Receipt, ArrowRightLeft, Users, UserCircle } from 'lucide-react';

const TripView = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [data, setData] = useState({ expenses: [], balances: {}, simplifiedDebts: [] });
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'balances'

  // Form states
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    if (trip) {
      setSelectedParticipants(trip.participants.map(p => p._id));
    }
  }, [trip]);

  const fetchTripData = async () => {
    try {
      const [tripRes, expenseRes] = await Promise.all([
        axios.get(`https://tripledger-gr2n.onrender.com/api/trips/${id}`),
        axios.get(`https://tripledger-gr2n.onrender.com/api/expenses/trip/${id}`)
      ]);
      setTrip(tripRes.data);
      setData(expenseRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!desc || !amount || selectedParticipants.length === 0) {
      alert('Please provide description, amount, and select at least one participant.');
      return;
    }
    try {
      await axios.post('https://tripledger-gr2n.onrender.com/api/expenses', {
        tripId: id,
        description: desc,
        amount: Number(amount),
        splitAmong: selectedParticipants
      });
      setDesc('');
      setAmount('');
      fetchTripData();
    } catch (err) {
      alert('Failed to add expense');
    }
  };

  const handleSettleUp = async (toUserId, amt) => {
    try {
      await axios.post('https://tripledger-gr2n.onrender.com/api/expenses/settle', {
        tripId: id,
        toUserId,
        amount: amt
      });
      fetchTripData();
      alert('Settled up successfully!');
    } catch (err) {
      alert('Failed to settle up');
    }
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div>
      <div className="card glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>{trip.name}</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> {trip.participants.length} Participants  &bull; ID: <strong>{trip.tripId}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '0.25rem' }}>
          <button 
            onClick={() => setActiveTab('expenses')}
            style={{ 
              padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer',
              backgroundColor: activeTab === 'expenses' ? 'white' : 'transparent',
              boxShadow: activeTab === 'expenses' ? 'var(--shadow-sm)' : 'none',
              color: activeTab === 'expenses' ? 'var(--primary-blue)' : 'var(--text-light)'
            }}
          >
            <Receipt size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Expenses
          </button>
          <button 
            onClick={() => setActiveTab('balances')}
            style={{ 
              padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer',
              backgroundColor: activeTab === 'balances' ? 'white' : 'transparent',
              boxShadow: activeTab === 'balances' ? 'var(--shadow-sm)' : 'none',
              color: activeTab === 'balances' ? 'var(--primary-blue)' : 'var(--text-light)'
            }}
          >
            <ArrowRightLeft size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Balances
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        
        {activeTab === 'expenses' && (
          <>
            {/* Add Expense Form */}
            <div className="card" style={{ height: 'fit-content' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Add New Expense</h3>
              <form onSubmit={handleAddExpense}>
                <input 
                  className="input-field" 
                  placeholder="What was it for?" 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <IndianRupee size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-light)' }} />
                  <input 
                    className="input-field" 
                    type="number"
                    step="0.01"
                    placeholder="0.00" 
                    style={{ paddingLeft: '2.5rem' }}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem', backgroundColor: '#F8F9FB', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-dark)' }}>Split among:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {trip.participants.map(p => (
                      <label key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedParticipants.includes(p._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedParticipants([...selectedParticipants, p._id]);
                            } else {
                              setSelectedParticipants(selectedParticipants.filter(pid => pid !== p._id));
                            }
                          }}
                        />
                        {p.name} {p._id === user?.id ? '(You)' : ''}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Expense</button>
              </form>
              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center' }}>
                Amount will be split equally among {selectedParticipants.length} selected participant(s).
              </p>
            </div>

            {/* Expenses List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.expenses.length === 0 ? (
                <div className="card glass-panel" style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                  No expenses added yet.
                </div>
              ) : (
                data.expenses.map(exp => (
                  <div key={exp._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{exp.description}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                        Paid by <strong>{exp.paidBy.name || 'User'}</strong> • {new Date(exp.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: exp.description === 'Settled Up' ? 'green' : 'var(--primary-blue)' }}>
                      ₹{exp.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'balances' && (
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>How to Settle up</h3>
              
              {data.simplifiedDebts.length === 0 ? (
                <p style={{ color: 'green', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   Everyone is settled up!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* YOUR BALANCES */}
                  <div>
                    <h4 style={{ color: 'var(--text-light)', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Your Balances</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {data.simplifiedDebts.filter(d => d.from === user?.id || d.to === user?.id).length === 0 ? (
                        <p style={{ color: 'var(--text-light)' }}>You are fully settled up!</p>
                      ) : (
                        data.simplifiedDebts.filter(d => d.from === user?.id || d.to === user?.id).map((debt, idx) => {
                          const fromUser = trip.participants.find(p => p._id === debt.from);
                          const toUser = trip.participants.find(p => p._id === debt.to);
                          if (!fromUser || !toUser) return null;
                          const isMe = fromUser._id === user?.id;
                          return (
                            <div key={`my-${idx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: isMe ? '#fffafa' : '#f0fdf4' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <UserCircle size={32} color={isMe ? 'red' : 'green'} />
                                <div style={{ fontSize: '1.1rem' }}>
                                  {isMe ? (
                                    <>You owe <strong>{toUser.name}</strong> <span style={{ color: 'red', fontWeight: 'bold' }}>₹{debt.amount.toFixed(2)}</span></>
                                  ) : (
                                    <><strong>{fromUser.name}</strong> owes You <span style={{ color: 'green', fontWeight: 'bold' }}>₹{debt.amount.toFixed(2)}</span></>
                                  )}
                                </div>
                              </div>
                              {isMe && (
                                <button className="btn btn-secondary" onClick={() => handleSettleUp(toUser._id, debt.amount)}>
                                  Mark as Paid
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* OTHER BALANCES */}
                  {data.simplifiedDebts.filter(d => d.from !== user?.id && d.to !== user?.id).length > 0 && (
                    <div>
                      <h4 style={{ color: 'var(--text-light)', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Other Group Balances</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.simplifiedDebts.filter(d => d.from !== user?.id && d.to !== user?.id).map((debt, idx) => {
                          const fromUser = trip.participants.find(p => p._id === debt.from);
                          const toUser = trip.participants.find(p => p._id === debt.to);
                          if (!fromUser || !toUser) return null;
                          return (
                            <div key={`other-${idx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <UserCircle size={32} color="var(--primary-blue)" />
                                <div style={{ fontSize: '1.1rem' }}>
                                  <strong>{fromUser.name}</strong> owes <strong>{toUser.name}</strong> 
                                  <span style={{ color: 'var(--text-light)', fontWeight: 'bold', marginLeft: '0.5rem' }}>₹{debt.amount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TripView;
