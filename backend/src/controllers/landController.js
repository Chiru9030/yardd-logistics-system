const store = require('../services/storeService');

exports.getLands = async (req, res) => {
    try {
        const { status, search } = req.query;
        const lands = await store.getLands({ status, search });
        res.json({ success: true, count: lands.length, data: lands });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getLandById = async (req, res) => {
    try {
        const land = await store.getLandById(req.params.id);
        if (!land) return res.status(404).json({ success: false, message: 'Land parcel not found' });
        res.json({ success: true, data: land });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createLand = async (req, res) => {
    try {
        const { title, survey_number, area_sqft, price, location, geo_coordinates, zoning_code, features } = req.body;
        if (!title || !survey_number || !area_sqft || !price) {
            return res.status(400).json({ success: false, message: 'Missing required parcel metadata.' });
        }

        const newLand = await store.createLand({
            seller_id: req.user?.id || 'usr-seller-01',
            title,
            survey_number,
            area_sqft: Number(area_sqft),
            price: Number(price),
            location: location || 'Strategic Freight Corridor',
            geo_coordinates: geo_coordinates || { lat: 38.0, lng: -97.0 },
            zoning_code: zoning_code || 'M-2 General Industrial',
            features: features || ['Highway Access', 'Truck Turning Radius']
        });

        res.status(201).json({ success: true, message: 'Parcel listed successfully', data: newLand });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.verifyLand = async (req, res) => {
    try {
        const { id } = req.params;
        const land = await store.updateLandStatus(id, 'VERIFIED', req.user?.id || 'usr-verifier-01');
        if (!land) return res.status(404).json({ success: false, message: 'Land parcel not found' });
        res.json({ success: true, message: 'Cadastral title verified and sealed', data: land });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
