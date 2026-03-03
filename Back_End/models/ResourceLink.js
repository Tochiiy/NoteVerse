import mongoose from "mongoose";

const resourceLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    url: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["book", "research", "ai", "sponsor"],
      required: true,
      index: true,
    },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const ResourceLink = mongoose.model("ResourceLink", resourceLinkSchema);

export default ResourceLink;
