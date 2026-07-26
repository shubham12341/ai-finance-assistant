import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const joined = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      {/* Avatar card */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
          {user?.fullName?.charAt(0) || "U"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
          <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
          <span className="inline-block mt-2 bg-green-900 text-green-400 text-xs px-3 py-1 rounded-full">
            Active
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 divide-y divide-slate-700">
        {[
          { label: "Full Name", value: user?.fullName, icon: "👤" },
          { label: "Email", value: user?.email, icon: "📧" },
          { label: "Member Since", value: joined, icon: "📅" },
          { label: "Account Status", value: "Active", icon: "✅" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <span className="text-white text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
        <h2 className="text-white font-medium mb-3">Account Info</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your data is securely stored and only accessible by you. All
          transactions are encrypted and your financial information is never
          shared with third parties.
        </p>
      </div>
    </div>
  );
}
