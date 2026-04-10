import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlaneTakeoff, ShieldCheck, Users, TrendingDown } from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', marginTop: '2rem' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
          Travel together. <span style={{ color: 'var(--secondary-blue)' }}>Split seamlessly.</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          TripLedger takes the headache out of group expenses. Add your purchases, and let our smart algorithm calculate exactly who owes what, minimizing the number of transactions needed to settle up.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Overview Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        
        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: '#e0f7fc', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <PlaneTakeoff size={36} color="var(--primary-blue)" />
          </div>
          <h3 style={{ fontSize: '1.3rem' }}>Perfect for Trips</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
            Whether it's a weekend getaway or a month-long backpacking adventure, keep your focus on the experience, not the receipts.
          </p>
        </div>

        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: '#e0f7fc', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <TrendingDown size={36} color="var(--primary-blue)" />
          </div>
          <h3 style={{ fontSize: '1.3rem' }}>Smart Simplification</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
            Our algorithm reduces the web of "A owes B, B owes C" into the simplest possible repayment plan, saving everyone time.
          </p>
        </div>

        <div className="card glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: '#e0f7fc', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Users size={36} color="var(--primary-blue)" />
          </div>
          <h3 style={{ fontSize: '1.3rem' }}>Shared Transparency</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
            Invite friends to your trip with a secure unique ID. Everyone can add expenses and view the live balance dashboard.
          </p>
        </div>

      </section>

    </div>
  );
};

export default Landing;
