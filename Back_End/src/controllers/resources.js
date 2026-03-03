import ResourceLink from "../../models/ResourceLink.js";

export const getResourceLinks = async (_req, res) => {
  try {
    const links = await ResourceLink.find({ active: true })
      .sort({ category: 1, order: 1, createdAt: -1 })
      .select("title description url category active order");

    return res.json({ links });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
