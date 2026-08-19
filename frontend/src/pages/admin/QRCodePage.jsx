import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function AdminQRCodePage() {

  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchQR = async () => {
    try {
      setLoading(true);
      const url = 'http://127.0.0.1:8000/api/qrcode';
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob' 
      });

      const imageUrl = URL.createObjectURL(res.data);
      setQrUrl(imageUrl);
    } catch (err) {
      console.log("QR ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQR();
  }, []);

  return (
    <div className="page-container fade-in">

      <div className="page-header">
        <h1 className="page-title">Company QR Code</h1>

      <div className="qr-actions">
        <button className="btn btn-primary" onClick={fetchQR}>
          Refresh QR
        </button>

        <button className="btn btn-secondary" onClick={() => window.print()}>
          Print QR
        </button>
      </div>
      </div>

      <div className="qr-page-content glass-panel">

        <div className="qr-scan-area"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300
          }}
        >

          {loading ? (
            <p>Loading...</p>
          ) : qrUrl ? (
            <img src={qrUrl} alt="QR" width={250} />
          ) : (
            <p>No QR</p>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdminQRCodePage;