const store = require('../services/storeService');

exports.getTransactions = async (req, res) => {
    try {
        const txs = await store.getTransactions();
        res.json({ success: true, count: txs.length, data: txs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { land_id, amount } = req.body;
        if (!land_id || !amount) {
            return res.status(400).json({ success: false, message: 'land_id and amount are required.' });
        }

        const land = await store.getLandById(land_id);
        if (!land) {
            return res.status(404).json({ success: false, message: 'Land parcel does not exist.' });
        }
        if (land.status === 'SOLD') {
            return res.status(400).json({ success: false, message: 'Parcel is already sold.' });
        }

        const newTx = await store.createTransaction({
            land_id,
            buyer_id: req.user?.id || 'usr-buyer-01',
            seller_id: land.seller_id,
            amount: Number(amount)
        });

        res.status(201).json({
            success: true,
            message: 'Escrow deposit transaction initiated',
            data: newTx
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const valid = ['ESCROW_DEPOSITED', 'VERIFICATION_PENDING', 'APPROVED', 'RELEASED', 'CANCELLED'];
        if (!valid.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${valid.join(', ')}` });
        }

        const updated = await store.updateTransactionStatus(id, status, req.user?.id || 'system');
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        res.json({
            success: true,
            message: `Transaction state successfully moved to ${status}`,
            data: updated
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
