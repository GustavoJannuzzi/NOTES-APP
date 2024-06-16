import React from "react";
import { getInitials } from "../../utils/helper";

interface ProfileInfoProps {
  onLogout: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials("John William")}
      </div>

      <div>
        <p className="text-sm font-medium">Willam</p>
        <button className="text-sm  underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
