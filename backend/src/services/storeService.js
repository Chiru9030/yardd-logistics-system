const { v4: uuidv4 } = require('uuid') || { v4: () => 'id-' + Math.random().toString(36).substr(2, 9) };
const bcrypt = require('bcrypt');

// Default Seed Data
const users = [
    {
        id: 'usr-buyer-01',
        email: 'buyer@yardd.com',
        name: 'Alex Vance (Logistics Buyer)',
        password_hash: bcrypt.hashSync('buyer123', 10),
        role: 'BUYER'
    },
    {
        id: 'usr-seller-01',
        email: 'seller@yardd.com',
        name: 'Jordan Bell (Terminal Seller)',
        password_hash: bcrypt.hashSync('seller123', 10),
        role: 'SELLER'
    },
    {
        id: 'usr-verifier-01',
        email: 'verifier@yardd.com',
        name: 'Elena Rostova (Cadastral Verifier)',
        password_hash: bcrypt.hashSync('verifier123', 10),
        role: 'VERIFIER'
    },
    {
        id: 'usr-admin-01',
        email: 'admin@yardd.com',
        name: 'System Administrator',
        password_hash: bcrypt.hashSync('admin123', 10),
        role: 'ADMIN'
    }
];

const lands = [
    {
        id: 'lnd-101',
        seller_id: 'usr-seller-01',
        title: 'Deep-Water Pier Logistics Yard 4A',
        survey_number: 'SY-4029-A',
        area_sqft: 85000,
        price: 2450000,
        location: 'Bay Area Intermodal Hub, Oakland, CA',
        geo_coordinates: { lat: 37.7955, lng: -122.2801 },
        zoning_code: 'M-4 Heavy Industrial / Intermodal',
        status: 'AVAILABLE',
        features: ['Container Staging', 'Direct Rail Spur', '3-Phase High Voltage', 'Security Fencing'],
        created_at: new Date('2026-01-15T08:00:00Z')
    },
    {
        id: 'lnd-102',
        seller_id: 'usr-seller-01',
        title: 'Midwest Freight Distribution Acreage',
        survey_number: 'SY-8812-B',
        area_sqft: 140000,
        price: 3800000,
        location: 'Inland Port Corridor, Joliet, IL',
        geo_coordinates: { lat: 41.5250, lng: -88.0817 },
        zoning_code: 'I-2 Logistics & Staging',
        status: 'UNDER_ESCROW',
        features: ['40 Dock Levelers', 'Trailer Parking 120 Units', 'Truck Scale On-Site'],
        created_at: new Date('2026-02-01T10:30:00Z')
    },
    {
        id: 'lnd-103',
        seller_id: 'usr-seller-01',
        title: 'Gulf Coast Cold-Chain Staging Plot',
        survey_number: 'SY-2031-C',
        area_sqft: 62000,
        price: 1950000,
        location: 'Port of Houston Gateway, TX',
        geo_coordinates: { lat: 29.7499, lng: -95.3584 },
        zoning_code: 'LI-1 Light Industrial & Cold Chain',
        status: 'VERIFIED',
        features: ['Reefer Plugs (48 Points)', 'Insulated Staging Pads', 'FEMA Zone X Dry'],
        created_at: new Date('2026-02-10T14:15:00Z')
    },
    {
        id: 'lnd-104',
        seller_id: 'usr-seller-01',
        title: 'Pacific Gateway Aerotropolis Parcel 9',
        survey_number: 'SY-7741-D',
        area_sqft: 110000,
        price: 4900000,
        location: 'SeaTac Logistics Boulevard, Seattle, WA',
        geo_coordinates: { lat: 47.4502, lng: -122.3088 },
        zoning_code: 'A-1 Airport Industrial / Air Cargo',
        status: 'AVAILABLE',
        features: ['Airside Access Corridor', 'Automated Security Gate', 'Fiber Ring Connectivity'],
        created_at: new Date('2026-02-20T09:00:00Z')
    }
];

const transactions = [
    {
        id: 'tx-501',
        land_id: 'lnd-102',
        buyer_id: 'usr-buyer-01',
        seller_id: 'usr-seller-01',
        amount: 3800000,
        status: 'ESCROW_DEPOSITED',
        escrow_ref: 'ESCROW-JOL-2026-8812',
        verified_by: null,
        created_at: new Date('2026-02-18T11:00:00Z')
    },
    {
        id: 'tx-500',
        land_id: 'lnd-103',
        buyer_id: 'usr-buyer-01',
        seller_id: 'usr-seller-01',
        amount: 1950000,
        status: 'APPROVED',
        escrow_ref: 'ESCROW-HOU-2026-2031',
        verified_by: 'usr-verifier-01',
        created_at: new Date('2026-02-12T16:30:00Z')
    }
];

const auditLogs = [
    {
        id: 'aud-01',
        user_id: 'usr-buyer-01',
        action: 'ESCROW_INITIATED',
        resource_id: 'tx-501',
        details: 'Buyer deposited $3,800,000 into multi-signature escrow vault for SY-8812-B.',
        ip_address: '192.168.1.42',
        timestamp: new Date('2026-02-18T11:00:00Z')
    },
    {
        id: 'aud-02',
        user_id: 'usr-verifier-01',
        action: 'TITLE_DEED_VERIFIED',
        resource_id: 'lnd-103',
        details: 'Cadastral registry confirmed clean lien-free status for SY-2031-C.',
        ip_address: '192.168.1.18',
        timestamp: new Date('2026-02-15T09:30:00Z')
    },
    {
        id: 'aud-03',
        user_id: 'usr-seller-01',
        action: 'LAND_LISTING_PUBLISHED',
        resource_id: 'lnd-104',
        details: 'New Pacific Gateway parcel SY-7741-D published to open freight registry.',
        ip_address: '192.168.1.88',
        timestamp: new Date('2026-02-20T09:00:00Z')
    }
];

class StoreService {
    // Users
    async findUserByEmail(email) {
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    async findUserById(id) {
        return users.find(u => u.id === id);
    }

    async createUser(userData) {
        const newUser = {
            id: 'usr-' + Date.now(),
            ...userData,
            created_at: new Date()
        };
        users.push(newUser);
        return newUser;
    }

    // Lands
    async getLands(filters = {}) {
        let results = [...lands];
        if (filters.status && filters.status !== 'ALL') {
            results = results.filter(l => l.status === filters.status);
        }
        if (filters.search) {
            const q = filters.search.toLowerCase();
            results = results.filter(l =>
                l.title.toLowerCase().includes(q) ||
                l.survey_number.toLowerCase().includes(q) ||
                l.location.toLowerCase().includes(q)
            );
        }
        return results;
    }

    async getLandById(id) {
        return lands.find(l => l.id === id);
    }

    async createLand(landData) {
        const newLand = {
            id: 'lnd-' + Date.now(),
            ...landData,
            status: 'AVAILABLE',
            created_at: new Date()
        };
        lands.unshift(newLand);
        this.addAuditLog(landData.seller_id || 'system', 'LAND_CREATED', newLand.id, `Listing created for survey ${newLand.survey_number}`);
        return newLand;
    }

    async updateLandStatus(id, status, actorId) {
        const land = lands.find(l => l.id === id);
        if (land) {
            const old = land.status;
            land.status = status;
            this.addAuditLog(actorId, 'LAND_STATUS_CHANGED', id, `Status transitioned from ${old} to ${status}`);
        }
        return land;
    }

    // Transactions
    async getTransactions() {
        return transactions.map(t => {
            const land = lands.find(l => l.id === t.land_id);
            const buyer = users.find(u => u.id === t.buyer_id);
            const seller = users.find(u => u.id === t.seller_id);
            return {
                ...t,
                land_title: land?.title || 'Parcel ' + t.land_id,
                survey_number: land?.survey_number || 'N/A',
                buyer_name: buyer?.name || t.buyer_id,
                seller_name: seller?.name || t.seller_id
            };
        });
    }

    async createTransaction(txData) {
        const newTx = {
            id: 'tx-' + Date.now(),
            ...txData,
            status: 'ESCROW_DEPOSITED',
            escrow_ref: 'ESCROW-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            created_at: new Date()
        };
        transactions.unshift(newTx);
        await this.updateLandStatus(txData.land_id, 'UNDER_ESCROW', txData.buyer_id);
        this.addAuditLog(txData.buyer_id, 'ESCROW_DEPOSITED', newTx.id, `Deposited $${txData.amount.toLocaleString()} into escrow ref ${newTx.escrow_ref}`);
        return newTx;
    }

    async updateTransactionStatus(id, newStatus, actorId) {
        const tx = transactions.find(t => t.id === id);
        if (!tx) return null;

        const oldStatus = tx.status;
        tx.status = newStatus;
        if (newStatus === 'APPROVED' || newStatus === 'RELEASED') {
            tx.verified_by = actorId;
            if (newStatus === 'RELEASED') {
                await this.updateLandStatus(tx.land_id, 'SOLD', actorId);
            }
        } else if (newStatus === 'CANCELLED') {
            await this.updateLandStatus(tx.land_id, 'AVAILABLE', actorId);
        }

        this.addAuditLog(actorId, `TX_${newStatus}`, id, `Transaction transitioned from ${oldStatus} to ${newStatus}`);
        return tx;
    }

    // Stats & Audit
    async getStats() {
        const totalListings = lands.length;
        const availableListings = lands.filter(l => l.status === 'AVAILABLE').length;
        const escrowParcels = lands.filter(l => l.status === 'UNDER_ESCROW').length;
        const verifiedParcels = lands.filter(l => l.status === 'VERIFIED').length;
        const totalEscrowVolume = transactions.reduce((acc, t) => acc + (t.status !== 'CANCELLED' ? Number(t.amount) : 0), 0);
        const totalSqft = lands.reduce((acc, l) => acc + Number(l.area_sqft), 0);

        return {
            totalListings,
            availableListings,
            escrowParcels,
            verifiedParcels,
            totalEscrowVolume,
            totalSqft,
            activeTransactions: transactions.length,
            recentAuditLogs: auditLogs.slice(0, 10)
        };
    }

    addAuditLog(userId, action, resourceId, details, ip = '127.0.0.1') {
        auditLogs.unshift({
            id: 'aud-' + Date.now(),
            user_id: userId,
            action,
            resource_id: resourceId,
            details,
            ip_address: ip,
            timestamp: new Date()
        });
    }

    async getAuditLogs() {
        return auditLogs;
    }
}

module.exports = new StoreService();
