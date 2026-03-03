import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../features/auth/AuthContext";
import {
  isCloudinaryConfigured,
  uploadSingleFileToCloudinary,
} from "../features/media/cloudinaryUpload";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, deleteAccount } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || user?.avatar || "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!isCloudinaryConfigured()) {
      toast.error("Cloudinary is not configured in frontend env");
      return;
    }

    try {
      setIsUploadingPicture(true);
      const url = await uploadSingleFileToCloudinary(file, "image");
      setProfilePicture(url);
      toast.success("Profile picture uploaded");
    } catch (err) {
      toast.error(err?.message || "Profile picture upload failed");
    } finally {
      setIsUploadingPicture(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({ name, bio, profilePicture });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Profile update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmFirst = window.confirm(
      "Are you sure you want to delete your account? This action is permanent.",
    );

    if (!confirmFirst) {
      return;
    }

    const confirmSecond = window.confirm(
      "This will remove your profile and all your notes. Continue?",
    );

    if (!confirmSecond) {
      return;
    }

    try {
      setIsDeletingAccount(true);
      await deleteAccount();
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete account");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <main className="min-h-screen pb-36 pt-10">
      <div className="mx-auto max-w-3xl px-4">
        <section className="rounded-3xl border border-base-content/10 bg-base-100/75 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-base-content">My Profile</h1>
          <p className="mt-2 text-base-content/70">
            Manage your account details.
          </p>

          <div className="mt-6 rounded-2xl border border-base-content/10 bg-base-100/70 p-4">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Email
            </p>
            <p className="mt-1 text-sm font-semibold text-base-content">
              {user?.email || "-"}
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="form-control w-full">
              <span className="label-text mb-2 text-sm font-semibold">
                Profile Picture URL
              </span>
              <input
                type="url"
                className="input input-bordered rounded-xl"
                value={profilePicture}
                onChange={(event) => setProfilePicture(event.target.value)}
                disabled={isSaving || isUploadingPicture}
                placeholder="https://..."
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-2 text-sm font-semibold">
                Upload Profile Picture
              </span>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full rounded-xl"
                onChange={handleProfilePictureUpload}
                disabled={isSaving || isUploadingPicture}
              />
            </label>

            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile preview"
                className="h-24 w-24 rounded-xl object-cover"
              />
            )}

            <label className="form-control w-full">
              <span className="label-text mb-2 text-sm font-semibold">
                Name
              </span>
              <input
                type="text"
                className="input input-bordered rounded-xl"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSaving}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-2 text-sm font-semibold">Bio</span>
              <textarea
                className="textarea textarea-bordered min-h-32 rounded-xl"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                disabled={isSaving}
                placeholder="Tell us about yourself"
              />
            </label>

            <button
              className="btn btn-primary rounded-xl"
              type="submit"
              disabled={isSaving || isUploadingPicture || isDeletingAccount}
            >
              {isSaving && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <section className="mt-8 rounded-2xl border border-error/40 bg-error/10 p-5">
            <h2 className="text-lg font-semibold text-base-content">
              Danger Zone
            </h2>
            <p className="mt-2 text-sm text-base-content/80">
              Delete your account permanently. This also deletes all notes
              linked to your account.
            </p>
            <button
              type="button"
              className="btn btn-error mt-4 rounded-xl"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount || isSaving || isUploadingPicture}
            >
              {isDeletingAccount ? "Deleting account..." : "Delete Account"}
            </button>
          </section>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;
