import Kosts from "../models/KostModel.js";

export const getKost = async (req, res) => {
    try {
        const kosts = await Kosts.findAll();
        res.json(kosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const addKost = async (req, res) => {
    const { place_name, owner, contact, price, rating, description } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    try {
        const data = await Kosts.create({
            place_name,
            owner,
            contact,
            price,
            rating,
            description,
            image: imageUrl,
        });
        res.json({ msg: "Kost Berhasil Didaftarkan", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateKost = async (req, res) => {
    const { place_name, owner, contact, price, rating, description } = req.body;
    let updateFields = { place_name, owner, contact, price, rating, description };

    if (req.file) {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        updateFields.image = imageUrl;
    }

    try {
        const [updated] = await Kosts.update(
            updateFields,
            { where: { id: req.params.id } }
        );
        if (!updated) return res.status(404).json({ message: 'Kost not found' });

        const updatedKost = await Kosts.findByPk(req.params.id);
        res.status(200).json({ msg: "Berhasil Update Kost", updatedKost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteKost = async (req, res) => {
    try {
        const kostId = req.params.id;
        const kost = await Kosts.findOne({ where: { id: kostId } });

        if (!kost) {
            return res.status(404).json({ msg: "Kost tidak ditemukan" });
        }

        await Kosts.destroy({ where: { id: kostId } });
        res.json({ msg: "Berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
