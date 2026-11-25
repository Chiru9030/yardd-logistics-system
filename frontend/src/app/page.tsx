"use client";

import React, { useState } from "react";

interface LandParcel {
  id: string;
  title: string;
  survey_number: string;
  area_sqft: number;
  price: number;
  location: string;
  zoning_code: string;
  status: "AVAILABLE" | "UNDER_ESCROW" | "VERIFIED" | "SOLD";
  features: string[];
}

interface EscrowTx {
  id: string;
  land_id: string;
  land_title: string;
  survey_number: string;
  buyer_name: string;
  amount: number;
  status: "ESCROW_DEPOSITED" | "VERIFICATION_PENDING" | "APPROVED" | "RELEASED" | "CANCELLED";
  escrow_ref: string;
  date: string;
}

interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  details: string;
  time: string;
}

const INITIAL_LANDS: LandParcel[] = [
  {
    id: "lnd-101",
    title: "Deep-Water Pier Logistics Yard 4A",
    survey_number: "SY-4029-A",
    area_sqft: 85000,
    price: 2450000,
    location: "Bay Area Intermodal Hub, Oakland, CA",
    zoning_code: "M-4 Heavy Industrial / Intermodal",
    status: "AVAILABLE",
    features: ["Container Staging", "Direct Rail Spur", "3-Phase High Voltage", "Security Fencing"]
  },
  {
    id: "lnd-102",
    title: "Midwest Freight Distribution Acreage",
    survey_number: "SY-8812-B",
    area_sqft: 140000,
    price: 3800000,
    location: "Inland Port Corridor, Joliet, IL",
    zoning_code: "I-2 Logistics & Staging",
    status: "UNDER_ESCROW",
    features: ["40 Dock Levelers", "Trailer Parking 120 Units", "Truck Scale On-Site"]
  },
  {
    id: "lnd-103",
    title: "Gulf Coast Cold-Chain Staging Plot",
    survey_number: "SY-2031-C",
    area_sqft: 62000,
    price: 1950000,
    location: "Port of Houston Gateway, TX",
    zoning_code: "LI-1 Light Industrial & Cold Chain",
    status: "VERIFIED",
    features: ["Reefer Plugs (48 Points)", "Insulated Staging Pads", "FEMA Zone X Dry"]
  },
  {
    id: "lnd-104",
    title: "Pacific Gateway Aerotropolis Parcel 9",
    survey_number: "SY-7741-D",
    area_sqft: 110000,
    price: 4900000,
    location: "SeaTac Logistics Boulevard, Seattle, WA",
    zoning_code: "A-1 Airport Industrial / Air Cargo",
    status: "AVAILABLE",
    features: ["Airside Access Corridor", "Automated Security Gate", "Fiber Ring Connectivity"]
  }
];

const INITIAL_TXS: EscrowTx[] = [
  {
    id: "tx-501",
    land_id: "lnd-102",
    land_title: "Midwest Freight Distribution Acreage",
    survey_number: "SY-8812-B",
    buyer_name: "Alex Vance (Logistics Buyer)",
    amount: 3800000,
    status: "ESCROW_DEPOSITED",
    escrow_ref: "ESCROW-JOL-2026-8812",
    date: "2026-02-18"
  },
  {
    id: "tx-500",
    land_id: "lnd-103",
    land_title: "Gulf Coast Cold-Chain Staging Plot",
    survey_number: "SY-2031-C",
    buyer_name: "Swift Maritime Logistics",
    amount: 1950000,
    status: "APPROVED",
    escrow_ref: "ESCROW-HOU-2026-2031",
    date: "2026-02-12"
  }
];

const INITIAL_AUDITS: AuditEntry[] = [
  {
    id: "aud-01",
    action: "ESCROW_INITIATED",
    actor: "Alex Vance (BUYER)",
    details: "Buyer deposited $3,800,000 into multi-signature escrow vault for SY-8812-B.",
    time: "10 mins ago"
  },
  {
    id: "aud-02",
    action: "TITLE_DEED_VERIFIED",
    actor: "Elena Rostova (VERIFIER)",
    details: "Cadastral registry confirmed clean lien-free status for SY-2031-C.",
    time: "2 hours ago"
  },
  {
    id: "aud-03",
    action: "LAND_LISTING_PUBLISHED",
    actor: "Jordan Bell (SELLER)",
    details: "New Pacific Gateway parcel SY-7741-D published to open freight registry.",
    time: "1 day ago"
  }
];

export default function Home() {
  const [role, setRole] = useState<"BUYER" | "SELLER" | "VERIFIER" | "ADMIN">("BUYER");
  const [activeTab, setActiveTab] = useState<"parcels" | "transactions" | "audits" | "new">("parcels");
  const [lands, setLands] = useState<LandParcel[]>(INITIAL_LANDS);
  const [txs, setTxs] = useState<EscrowTx[]>(INITIAL_TXS);
  const [audits, setAudits] = useState<AuditEntry[]>(INITIAL_AUDITS);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newSurvey, setNewSurvey] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newZoning, setNewZoning] = useState("Heavy Logistics / Intermodal");

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDepositEscrow = (land: LandParcel) => {
    const updated = lands.map(l => l.id === land.id ? { ...l, status: "UNDER_ESCROW" as const } : l);
    setLands(updated);

    const newTx: EscrowTx = {
      id: "tx-" + Date.now(),
      land_id: land.id,
      land_title: land.title,
      survey_number: land.survey_number,
      buyer_name: `${role} User Account`,
      amount: land.price,
      status: "ESCROW_DEPOSITED",
      escrow_ref: "ESC-" + Math.random().toString(36).substr(2, 7).toUpperCase(),
      date: new Date().toISOString().split("T")[0]
    };
    setTxs([newTx, ...txs]);

    const newAudit: AuditEntry = {
      id: "aud-" + Date.now(),
      action: "ESCROW_DEPOSITED",
      actor: `${role} Account`,
      details: `Escrow deposit of $${land.price.toLocaleString()} placed for survey ${land.survey_number}.`,
      time: "Just now"
    };
    setAudits([newAudit, ...audits]);
    notify(`✓ Escrow deposit initiated for ${land.title}. Status moved to UNDER ESCROW.`);
  };

  const handleVerify = (land: LandParcel) => {
    const updated = lands.map(l => l.id === land.id ? { ...l, status: "VERIFIED" as const } : l);
    setLands(updated);

    const newAudit: AuditEntry = {
      id: "aud-" + Date.now(),
      action: "TITLE_VERIFIED",
      actor: `${role} Verifier`,
      details: `Cadastral verification sealed for survey ${land.survey_number}. Clear title guaranteed.`,
      time: "Just now"
    };
    setAudits([newAudit, ...audits]);
    notify(`✓ Survey ${land.survey_number} verified and marked lien-free!`);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSurvey || !newPrice || !newArea) {
      alert("Please fill all required fields");
      return;
    }

    const created: LandParcel = {
      id: "lnd-" + Date.now(),
      title: newTitle,
      survey_number: newSurvey,
      area_sqft: Number(newArea),
      price: Number(newPrice),
      location: newLocation || "Intermodal Logistics Zone",
      zoning_code: newZoning,
      status: "AVAILABLE",
      features: ["All-Weather Pavement", "Security Gating", "Heavy Axle Load Certified"]
    };

    setLands([created, ...lands]);
    const newAudit: AuditEntry = {
      id: "aud-" + Date.now(),
      action: "PARCEL_LISTED",
      actor: `${role} Seller`,
      details: `New yard listing registered: ${newTitle} (${newSurvey}) for $${Number(newPrice).toLocaleString()}.`,
      time: "Just now"
    };
    setAudits([newAudit, ...audits]);

    setNewTitle("");
    setNewSurvey("");
    setNewArea("");
    setNewPrice("");
    setNewLocation("");
    setActiveTab("parcels");
    notify(`✓ Parcel ${newSurvey} listed successfully on Yardd exchange.`);
  };

  const filteredLands = lands.filter(l => {
    const matchesStatus = filterStatus === "ALL" || l.status === filterStatus;
    const matchesSearch = searchQuery === "" ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.survey_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalEscrowVolume = txs.reduce((sum, t) => sum + (t.status !== "CANCELLED" ? t.amount : 0), 0);
  const totalSqft = lands.reduce((sum, l) => sum + l.area_sqft, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-400 font-medium animate-bounce">
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
              Y
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">YARDD</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold uppercase">
                  Logistics Exchange
                </span>
              </div>
              <p className="text-xs text-slate-400">Secure Freight Terminal & Parcel Escrow Platform</p>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 px-2 font-medium">Viewing as:</span>
            {(["BUYER", "SELLER", "VERIFIER", "ADMIN"] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  role === r
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Total Staging Area</span>
            <div className="text-2xl font-black text-white mt-1">{(totalSqft / 1000).toFixed(0)}k sq ft</div>
            <p className="text-xs text-slate-500 mt-1">{lands.length} Industrial Parcels Managed</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Escrow Value Locked</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">${(totalEscrowVolume / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-slate-500 mt-1">{txs.length} Active Escrow Agreements</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Verified Titles</span>
            <div className="text-2xl font-black text-blue-400 mt-1">
              {lands.filter(l => l.status === "VERIFIED").length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Lien-Free Cadastral Proofs</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Audit Ledger Integrity</span>
            <div className="text-2xl font-black text-purple-400 mt-1">100%</div>
            <p className="text-xs text-slate-500 mt-1">{audits.length} Events Committed</p>
          </div>
        </div>
      </section>

      {/* Main Tabs */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex border-b border-slate-800 gap-4 mb-6">
          <button
            onClick={() => setActiveTab("parcels")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "parcels"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Available Terminal Parcels ({lands.length})
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "transactions"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Escrow Transactions ({txs.length})
          </button>
          <button
            onClick={() => setActiveTab("audits")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "audits"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Security & Audit Ledger ({audits.length})
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "new"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            + List New Parcel
          </button>
        </div>

        {/* Tab 1: Parcels Grid */}
        {activeTab === "parcels" && (
          <div>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <input
                type="text"
                placeholder="Search survey #, city, or terminal name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                {["ALL", "AVAILABLE", "UNDER_ESCROW", "VERIFIED"].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium border ${
                      filterStatus === st
                        ? "bg-slate-800 border-slate-600 text-white"
                        : "border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLands.map(land => (
                <div
                  key={land.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="text-xs font-mono text-blue-400 font-semibold">{land.survey_number}</span>
                        <h3 className="text-lg font-bold text-white mt-0.5">{land.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">📍 {land.location}</p>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          land.status === "AVAILABLE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : land.status === "VERIFIED"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            : land.status === "UNDER_ESCROW"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {land.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-4 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Area</span>
                        <p className="text-sm font-bold text-slate-200">{land.area_sqft.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Zoning Code</span>
                        <p className="text-sm font-bold text-slate-200">{land.zoning_code}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {land.features.map(f => (
                        <span key={f} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Listing Valuation</span>
                      <p className="text-xl font-black text-white">${land.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {role === "VERIFIER" && land.status !== "VERIFIED" && (
                        <button
                          onClick={() => handleVerify(land)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/20"
                        >
                          Verify Title
                        </button>
                      )}

                      {land.status === "AVAILABLE" && (
                        <button
                          onClick={() => handleDepositEscrow(land)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                        >
                          Deposit Escrow
                        </button>
                      )}

                      {land.status === "UNDER_ESCROW" && (
                        <span className="text-xs text-amber-400 font-semibold px-3 py-1.5 bg-amber-500/10 rounded-lg">
                          Locked in Escrow
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Escrow Transactions */}
        {activeTab === "transactions" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800">
              <h3 className="font-bold text-white">Multi-Signature Escrow Transactions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated settlement ledger protecting buyer funds until title release.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/70 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Escrow Ref</th>
                    <th className="px-6 py-3.5">Parcel / Survey</th>
                    <th className="px-6 py-3.5">Buyer</th>
                    <th className="px-6 py-3.5">Escrow Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {txs.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-blue-400 font-bold">{t.escrow_ref}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{t.land_title}</div>
                        <div className="text-xs text-slate-500 font-mono">{t.survey_number}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{t.buyer_name}</td>
                      <td className="px-6 py-4 font-mono font-bold text-white">${t.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Audits */}
        {activeTab === "audits" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white mb-1">Cryptographic Cadastral Audit Log</h3>
            <p className="text-xs text-slate-400 mb-6">Append-only audit stream tracking all title actions and escrow deposits.</p>

            <div className="space-y-4">
              {audits.map(a => (
                <div key={a.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-400">{a.action}</span>
                      <span className="text-xs text-slate-500">{a.time}</span>
                    </div>
                    <p className="text-sm text-slate-200 mt-1">{a.details}</p>
                    <span className="text-xs text-slate-400 mt-1 inline-block">Actor: {a.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Form */}
        {activeTab === "new" && (
          <div className="max-w-2xl bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">List New Freight Terminal Parcel</h3>
            <p className="text-xs text-slate-400 mb-6">Register an industrial acreage, container staging yard, or rail intermodal plot.</p>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Parcel / Terminal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inland Empire Rail Logistics Hub"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Cadastral Survey #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SY-9920-X"
                    value={newSurvey}
                    onChange={e => setNewSurvey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Area (Square Feet)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 95000"
                    value={newArea}
                    onChange={e => setNewArea(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Asking Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3200000"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Zoning Code</label>
                  <input
                    type="text"
                    placeholder="e.g. M-3 Intermodal Heavy"
                    value={newZoning}
                    onChange={e => setNewZoning(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Geographic Location</label>
                <input
                  type="text"
                  placeholder="e.g. Logistics Gateway, Ontario, CA"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30"
              >
                Submit Listing to Yardd Exchange
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
