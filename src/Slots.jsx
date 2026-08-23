import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

const rowStructure = [8, 8, 10, 10, 8, 8];

const Slots = ({ loggedUser, setUser }) => {
  const [slots, setSlots] = useState([]);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [lastRemovedTime, setLastRemovedTime] = useState(null);
  const [pastBookings, setPastBookings] = useState([]);

  const isAdmin = loggedUser?.role === "admin";
  const navigate = useNavigate();

  const fetchSlots = () => {
    fetch("http://localhost:5000/slots")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(s => ({
          id: s.id,
          status: s.status,
          reservedBy: s.reserved_by,
          row: parseInt(s.id[1]) - 1,
        }));
        setSlots(mapped);
      })
      .catch(err => console.error("Failed to fetch slots:", err));
  };

  const fetchBookings = () => {
    fetch(`http://localhost:5000/bookings/${loggedUser?.email}?role=${loggedUser?.role}`)
      .then(res => res.json())
      .then(data => setPastBookings(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch bookings:", err));
  };

  useEffect(() => {
    fetchSlots();
    fetchBookings();
    const interval = setInterval(() => {
      fetchSlots();
      fetchBookings();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isOnCooldown = () =>
    lastRemovedTime && new Date().getTime() - lastRemovedTime < 15 * 60 * 1000;

  const userBooking = slots.find(s => s.reservedBy === loggedUser?.email)?.id || null;

  const handleSlotClick = (slot) => {
    if (slot.status === "blocked" && !isAdmin) return;
    if (userBooking && slot.id !== userBooking && !isAdmin) {
      alert("You already have an active booking! Release it first.");
      return;
    }
    if (isOnCooldown() && slot.status === "available" && !isAdmin) {
      alert("You just removed a booking! Wait 15 minutes before booking another slot.");
      return;
    }
    if (slot.status === "available" || slot.reservedBy === loggedUser?.email || isAdmin) {
      setSelectedSlotId(slot.id === selectedSlotId ? null : slot.id);
    }
  };

  const bookSlot = async () => {
    if (!selectedSlotId) return alert("Select a slot first!");
    if (userBooking) return alert("You already have an active booking!");
    if (isOnCooldown()) return alert("Wait 15 minutes before booking again!");
    const slot = slots.find(s => s.id === selectedSlotId);
    if (slot.status !== "available") return alert("Slot is not available!");
    if (!window.confirm(`Confirm booking for ${slot.id}?`)) return;

    const res = await fetch("http://localhost:5000/slots/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId: selectedSlotId, email: loggedUser?.email })
    });
    const result = await res.json();
    if (!res.ok) return alert(result.msg);
    fetchSlots();
    fetchBookings();
  };

  const releaseSlot = async () => {
    if (!selectedSlotId) return alert("Select a slot first!");
    const slot = slots.find(s => s.id === selectedSlotId);
    if (slot.reservedBy !== loggedUser?.email) return alert("You can only release your own booking!");
    if (!window.confirm(`Confirm releasing ${slot.id}?`)) return;

    const res = await fetch("http://localhost:5000/slots/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId: selectedSlotId, email: loggedUser?.email })
    });
    const result = await res.json();
    if (!res.ok) return alert(result.msg);
    setLastRemovedTime(new Date().getTime());
    setSelectedSlotId(null);
    fetchSlots();
    fetchBookings();
  };

  const blockSlot = async () => {
    if (!selectedSlotId) return alert("Select a slot first!");
    const slot = slots.find(s => s.id === selectedSlotId);
    const action = slot.status === "blocked" ? "unblock" : "block";
    if (!window.confirm(`Confirm ${action} for ${slot.id}?`)) return;

    const res = await fetch("http://localhost:5000/slots/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId: selectedSlotId, action })
    });
    const result = await res.json();
    if (!res.ok) return alert(result.msg);
    fetchSlots();
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const getSlotClass = (slot) => {
    const classes = ["slot"];
    if (slot.id === selectedSlotId) {
      classes.push("selected-slot");
    } else if (slot.status === "blocked") {
      classes.push("blocked");
    } else if (slot.status === "booked") {
      if (slot.reservedBy === loggedUser?.email) classes.push("my-booking");
      else classes.push("booked");
    } else {
      classes.push("available");
    }
    return classes.join(" ");
  };

  const renderTooltip = (slot) => {
    if (!hoveredSlot || hoveredSlot.id !== slot.id || slot.status === "available") return null;
    const msg = slot.status === "blocked"
      ? "Blocked by admin"
      : slot.reservedBy === loggedUser?.email
        ? "Your booking"
        : `Reserved by ${slot.reservedBy}`;
    return <div className="slot-tooltip">{msg}</div>;
  };

  const renderRows = () =>
    rowStructure.map((_, rowIndex) => {
      const rowSlots = slots.filter(s => s.row === rowIndex);
      const isEdge = rowIndex === 0 || rowIndex === rowStructure.length - 1;
      return (
        <div key={rowIndex} className="slot-row">
          {isEdge
            ? <div className="entry-exit">ENTRY</div>
            : <div style={{ width: "62px", margin: "4px", flexShrink: 0 }} />}

          {rowSlots.map(slot => (
            <div
              key={slot.id}
              className={getSlotClass(slot)}
              onClick={() => handleSlotClick(slot)}
              onMouseEnter={() => setHoveredSlot(slot)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              {slot.id}
              {renderTooltip(slot)}
            </div>
          ))}

          {isEdge
            ? <div className="entry-exit">EXIT</div>
            : <div style={{ width: "62px", margin: "4px", flexShrink: 0 }} />}
        </div>
      );
    });

  const selectedSlot = slots.find(s => s.id === selectedSlotId);
  const isSelectedBlocked = selectedSlot?.status === "blocked";

  return (
    <div className="page">
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">P</div>
          <div className="brand-text">
            <span className="brand-name">ParkSmart</span>
            <span className="brand-sub">Campus Parking</span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-badge">
            <div className="user-avatar">{isAdmin ? "A" : "S"}</div>
            <div className="user-info">
              <span className="user-email">{loggedUser?.email}</span>
              <span className="user-role">{isAdmin ? "Administrator" : "Student"}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Parking Dashboard</h2>
            <p className="page-subtitle">Select a slot to book or manage your reservations</p>
          </div>
          <div className="legend">
            <div className="legend-item"><div className="legend-dot available" />Available</div>
            <div className="legend-item"><div className="legend-dot booked" />Booked</div>
            <div className="legend-item"><div className="legend-dot blocked" />Blocked</div>
            <div className="legend-item"><div className="legend-dot selected" />Selected</div>
          </div>
        </div>

        <div className="slots-layout">
          <div className="parking-area">
            <div className="parking-area-card">
              {slots.length === 0
                ? <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>Loading slots...</p>
                : renderRows()
              }
            </div>
          </div>

          <div className="bookings-panel">
            <div className="panel-card">
              <h3>Actions</h3>

              <div className="selected-info">
                {selectedSlotId
                  ? <>Selected slot: <strong>{selectedSlotId}</strong></>
                  : "No slot selected — tap a slot to begin"
                }
                {userBooking && <><br /><span style={{ fontSize: 12, color: "var(--gold-dim)", marginTop: 4, display: "block" }}>Active booking: {userBooking}</span></>}
              </div>

              <div className="action-buttons">
                {!isAdmin && (
                  <>
                    <button className="btn-book" onClick={bookSlot}>Book Slot</button>
                    <button className="btn-release" onClick={releaseSlot}>Release Slot</button>
                  </>
                )}

                {isAdmin && (
                  <button
                    className={isSelectedBlocked ? "btn-unblock" : "btn-block"}
                    onClick={blockSlot}
                  >
                    {isSelectedBlocked ? "Unblock Slot" : "Block Slot"}
                  </button>
                )}
              </div>
            </div>

            <div className="panel-card">
              <h3>Stats</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Available", count: slots.filter(s => s.status === "available").length, color: "#22c55e" },
                  { label: "Booked", count: slots.filter(s => s.status === "booked").length, color: "#94a3b8" },
                  { label: "Blocked", count: slots.filter(s => s.status === "blocked").length, color: "#ef4444" },
                ].map(({ label, count, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: `${color}10`, border: `1px solid ${color}25` }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-mid)" }}>{label}</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'Outfit', sans-serif" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PAST BOOKINGS TABLE ── */}
        <div className="bookings-table-wrap">
          <div className="bookings-table-header">
            <h3>
              Booking History
              {isAdmin && <span className="badge-admin">ALL USERS</span>}
            </h3>
          </div>

          {pastBookings.length === 0 ? (
            <div className="no-bookings">
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--navy-mid)", marginBottom: 4 }}>P</p>
              <p>No bookings yet. Start by selecting a slot above.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="bookings-table">
                <thead>
                  <tr>
                    {isAdmin && <th>User</th>}
                    <th>Slot</th>
                    <th>Booked At</th>
                    <th>Released At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastBookings.map(b => (
                    <tr key={b.id}>
                      {isAdmin && <td style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{b.user_email}</td>}
                      <td><strong style={{ color: "var(--navy)", fontFamily: "'Outfit', sans-serif", fontSize: 14 }}>{b.slot_id}</strong></td>
                      <td>{new Date(b.booked_at).toLocaleString()}</td>
                      <td style={{ color: "var(--text-muted)" }}>
                        {b.released_at ? new Date(b.released_at).toLocaleString() : "—"}
                      </td>
                      <td>
                        <span className={`status-badge ${b.status === "active" ? "active" : "released"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slots;