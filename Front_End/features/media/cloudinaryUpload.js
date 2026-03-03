const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const ALLOWED_RESOURCE_TYPES = new Set(["image", "video"]);

const getUploadUrl = (resourceType) =>
  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

const ensureConfig = () => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.",
    );
  }
};

export const uploadSingleFileToCloudinary = async (file, resourceType) => {
  ensureConfig();

  if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
    throw new Error("Unsupported media type");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", getUploadUrl(resourceType));

    xhr.onload = () => {
      const result = JSON.parse(xhr.responseText || "{}");

      if (xhr.status >= 200 && xhr.status < 300 && result?.secure_url) {
        resolve(result.secure_url);
        return;
      }

      reject(new Error(result?.error?.message || "Cloudinary upload failed"));
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(formData);
  });
};

export const uploadSingleFileToCloudinaryWithProgress = (
  file,
  resourceType,
  onProgress,
) => {
  ensureConfig();

  if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
    throw new Error("Unsupported media type");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", getUploadUrl(resourceType));

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || typeof onProgress !== "function") {
        return;
      }

      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };

    xhr.onload = () => {
      const result = JSON.parse(xhr.responseText || "{}");

      if (xhr.status >= 200 && xhr.status < 300 && result?.secure_url) {
        resolve(result.secure_url);
        return;
      }

      reject(new Error(result?.error?.message || "Cloudinary upload failed"));
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(formData);
  });
};

export const isCloudinaryConfigured = () =>
  Boolean(CLOUD_NAME && UPLOAD_PRESET);
