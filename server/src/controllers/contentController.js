import { query } from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    const splitUrl = url.split('/');
    const filename = splitUrl[splitUrl.length - 1];
    const folder = splitUrl[splitUrl.length - 2];
    return `${folder}/${filename.split('.')[0]}`;
};


const getQuotes = async (req, res) => {
    try {
        const result = await query(`SELECT * FROM quotes ORDER BY created_at DESC`);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching quotes' });
    }
};

const addQuote = async (req, res) => {
    const { quote_text, author, anime, quote_type } = req.body;
    try {
        await query(
            `INSERT INTO quotes (quote_text, author, anime, quote_type) VALUES ($1, $2, $3, $4)`,
            [quote_text, author, anime, quote_type || 'normal']
        );
        res.status(201).json({ success: true, message: 'Quote added!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error adding quote' });
    }
};

const editQuote = async (req, res) => {
    const { quote_text, author, anime, quote_type } = req.body;
    try {
        await query(
            `UPDATE quotes SET quote_text = $1, author = $2, anime = $3, quote_type = $4 WHERE id = $5`,
            [quote_text, author, anime, quote_type || 'normal', req.params.id]
        );
        res.status(200).json({ success: true, message: 'Quote updated!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating quote' });
    }
};

const toggleQuoteStatus = async (req, res) => {
    try {
        await query(`UPDATE quotes SET is_active = NOT is_active WHERE id = $1`, [req.params.id]);
        res.status(200).json({ success: true, message: 'Quote visibility toggled!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error toggling quote' });
    }
};

const deleteQuote = async (req, res) => {
    try {
        await query(`DELETE FROM quotes WHERE id = $1`, [req.params.id]);
        res.status(200).json({ success: true, message: 'Quote deleted!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting quote' });
    }
};


const getBanners = async (req, res) => {
    try {
        const result = await query(`SELECT * FROM hero_banners ORDER BY display_order ASC`);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching banners' });
    }
};

const addBanner = async (req, res) => {
    const { title, subtitle, target_url, banner_type } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Banner image is required' });
    }

    let imagePath = req.file.path; 

    if (!imagePath.includes('cloudinary')) {
        try {
            const folderName = process.env.NODE_ENV === 'production' ? 'carousel_banners' : 'dev_carousel';
            const result = await cloudinary.uploader.upload(req.file.path, { 
                folder: folderName,
                format: 'webp',
                transformation: [{ width: 1920, crop: 'limit' }, { quality: 'auto:best' }]
            });
            imagePath = result.secure_url;
            
            import('fs').then(fs => fs.unlinkSync(req.file.path)).catch(()=>console.log("Cleanup skipped"));
        } catch (uploadErr) {
            console.error("Cloudinary upload failed:", uploadErr);
            return res.status(500).json({ success: false, message: 'Error uploading image to CDN' });
        }
    }

    try {
        const orderRes = await query(`SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM hero_banners`);
        const nextOrder = orderRes.rows[0].next_order;

        await query(
            `INSERT INTO hero_banners (title, subtitle, image_path, target_url, banner_type, display_order) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [title, subtitle, imagePath, target_url, banner_type || 'home', nextOrder]
        );
        res.status(201).json({ success: true, message: 'Banner uploaded!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error saving banner to database' });
    }
};

const toggleBannerStatus = async (req, res) => {
    try {
        await query(`UPDATE hero_banners SET is_active = NOT is_active WHERE id = $1`, [req.params.id]);
        res.status(200).json({ success: true, message: 'Banner visibility toggled!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error toggling banner' });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const bannerRes = await query(`SELECT image_path FROM hero_banners WHERE id = $1`, [req.params.id]);
        
        if (bannerRes.rows.length > 0) {
            const imageUrl = bannerRes.rows[0].image_path;
            const publicId = getPublicIdFromUrl(imageUrl);
            
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
            
            await query(`DELETE FROM hero_banners WHERE id = $1`, [req.params.id]);
        }
        res.status(200).json({ success: true, message: 'Banner deleted!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting banner' });
    }
};

export default { 
    getQuotes, addQuote, toggleQuoteStatus, deleteQuote, editQuote,
    getBanners, addBanner, toggleBannerStatus, deleteBanner 
};