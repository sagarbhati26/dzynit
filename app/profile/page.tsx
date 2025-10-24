"use client";

import { useState } from "react";
import Link from "next/link";
import DraftCard from "../../components/DraftCard";

// Mock data for user profile
const user = {
  name: "Alex Johnson",
  username: "alexj",
  bio: "Digital designer and t-shirt enthusiast. Creating unique apparel designs since 2020.",
  joinDate: "March 2023",
  avatar: "/avatar-placeholder.png" // This would be replaced with an actual avatar image
};

// Mock data for drafts and published designs
const drafts = [
  { id: 1, title: "Summer Vibes", date: "2 days ago" },
  { id: 2, title: "Geometric Pattern", date: "1 week ago" },
  { id: 3, title: "Typography Experiment", date: "2 weeks ago" }
];

const publishedDesigns = [
  { id: 1, title: "Mountain Sunset", sales: 24, revenue: "$479.76", date: "Apr 12, 2023" },
  { id: 2, title: "Abstract Waves", sales: 18, revenue: "$359.82", date: "May 3, 2023" },
  { id: 3, title: "Minimalist Lines", sales: 31, revenue: "$619.69", date: "Jun 22, 2023" }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("drafts");
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Profile Header */}
        <div className="card-glass rounded-xl p-6 soft-shadow mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted">@{user.username}</p>
              <p className="mt-2 text-sm max-w-2xl">{user.bio}</p>
              <p className="text-xs text-muted mt-2">Member since {user.joinDate}</p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/dzyn">
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                  New Design
                </button>
              </Link>
              <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-background/80 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-glass rounded-xl p-5 soft-shadow">
            <div className="text-sm text-muted mb-1">Total Designs</div>
            <div className="text-3xl font-bold">{drafts.length + publishedDesigns.length}</div>
          </div>
          <div className="card-glass rounded-xl p-5 soft-shadow">
            <div className="text-sm text-muted mb-1">Total Sales</div>
            <div className="text-3xl font-bold">{publishedDesigns.reduce((sum, design) => sum + design.sales, 0)}</div>
          </div>
          <div className="card-glass rounded-xl p-5 soft-shadow">
            <div className="text-sm text-muted mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-primary">
              ${publishedDesigns.reduce((sum, design) => sum + parseFloat(design.revenue.substring(1)), 0).toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("drafts")}
            className={`py-3 px-5 text-sm font-medium transition-colors ${
              activeTab === "drafts" 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted hover:text-foreground"
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`py-3 px-5 text-sm font-medium transition-colors ${
              activeTab === "published" 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted hover:text-foreground"
            }`}
          >
            Published Designs
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-5 text-sm font-medium transition-colors ${
              activeTab === "settings" 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted hover:text-foreground"
            }`}
          >
            Account Settings
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === "drafts" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Drafts</h2>
              <Link href="/dzyn">
                <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14"></path>
                    <path d="M5 12h14"></path>
                  </svg>
                  New Draft
                </button>
              </Link>
            </div>
            
            {drafts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {drafts.map((draft) => (
                  <Link key={draft.id} href={`/dzyn?draft=${draft.id}`}>
                    <DraftCard title={draft.title} date={draft.date} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted mb-3">You don't have any drafts yet</div>
                <Link href="/dzyn">
                  <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                    Create Your First Design
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "published" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Published Designs</h2>
            
            {publishedDesigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium">Design</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Sales</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publishedDesigns.map((design) => (
                      <tr key={design.id} className="border-b border-border hover:bg-background/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-primary/10"></div>
                            <span className="font-medium">{design.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted">{design.date}</td>
                        <td className="py-4 px-4 text-sm">{design.sales}</td>
                        <td className="py-4 px-4 text-sm font-medium text-primary">{design.revenue}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1.5 rounded-md hover:bg-background transition-colors text-muted hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-background transition-colors text-muted hover:text-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8"></path>
                                <path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted mb-3">You haven't published any designs yet</div>
                <Link href="/dzyn">
                  <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                    Create and Publish a Design
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="card-glass rounded-xl p-6 soft-shadow mb-6">
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user.name}
                    className="w-full rounded-lg p-3 border border-border bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input 
                    type="text" 
                    defaultValue={user.username}
                    className="w-full rounded-lg p-3 border border-border bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea 
                    defaultValue={user.bio}
                    rows={3}
                    className="w-full rounded-lg p-3 border border-border bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                
                <div className="pt-2">
                  <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card-glass rounded-xl p-6 soft-shadow">
              <h3 className="text-lg font-medium mb-4">Payment Information</h3>
              <p className="text-muted mb-4">Connect your payment method to receive earnings from your designs.</p>
              
              <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-background/80 transition-colors">
                Connect Payment Method
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}