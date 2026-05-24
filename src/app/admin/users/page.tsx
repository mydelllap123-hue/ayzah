"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  Calendar,
  Loader2,
  MoreVertical,
  UserCheck,
  UserX
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role })
      });
      if (res.ok) {
        toast.success(`User role updated to ${role}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">User Management</h1>
          <p className="text-brown-500 font-medium mt-1">Manage customer accounts and administrative roles.</p>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 bg-white rounded-2xl shadow-sm border border-pickle-100 overflow-hidden">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brown-400" size={20} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="w-full pl-14 pr-6 py-5 focus:outline-none font-medium text-brown-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-white px-8 py-5 rounded-2xl border border-pickle-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-pickle-50 text-pickle-600 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-brown-400 uppercase tracking-widest">Total Users</p>
            <p className="text-xl font-black text-brown-900">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-pickle-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-pickle-50/50 border-b border-pickle-100">
              <tr>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">Email Address</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-6 text-xs font-black text-brown-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pickle-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin text-pickle-600 mx-auto" size={40} />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-brown-500 font-bold">No users found.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-pickle-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pickle-100 rounded-full flex items-center justify-center text-pickle-600 font-black overflow-hidden border-2 border-white shadow-sm">
                        {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-brown-900 tracking-tight">{user.name}</p>
                        <p className="text-[10px] text-brown-400 font-bold uppercase">{user.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-brown-600">
                      <Mail size={14} className="text-pickle-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' || user.role === 'superadmin' ? 'bg-amber-100 text-amber-700' : 'bg-pickle-100 text-pickle-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-brown-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="relative group/menu">
                        <button className="p-2.5 bg-pickle-50 text-pickle-600 rounded-xl hover:bg-pickle-600 hover:text-white transition-all shadow-sm">
                          <UserCheck size={18} />
                        </button>
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-pickle-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                          {["user", "admin"].map((r) => (
                            <button 
                              key={r}
                              onClick={() => changeRole(user._id, r)}
                              className="w-full text-left px-5 py-3 text-xs font-bold text-brown-600 hover:bg-pickle-50 hover:text-pickle-600 transition-colors uppercase tracking-wider border-b border-pickle-50 last:border-0"
                            >
                              Make {r}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteUser(user._id)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
