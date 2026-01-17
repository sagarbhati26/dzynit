"use client";

import { useState } from "react";
import Link from "next/link";
import DraftCard from "../../components/DraftCard";

// Mock data for user profile
const user = {
  name: "sagar bhati",
  username: "sagarbhati",
  bio: "Digital designer and t-shirt enthusiast. Creating unique apparel designs since 2020.",
  joinDate: "March 2023",
  avatar: "/avatar-placeholder.png",
  followers: 675,
  following: 445
};

// Mock data for posts (designs) and drafts
const posts = [
  { id: 1, title: "Purple Tee", likes: 83, comments: 10, date: "Aug 4, 2025" },
  { id: 2, title: "Sleeve Script", likes: 42, comments: 3, date: "Sep 12, 2025" },
  { id: 3, title: "Minimal Logo", likes: 58, comments: 6, date: "Oct 7, 2025" },
  { id: 4, title: "Gradient Waves", likes: 31, comments: 2, date: "Oct 20, 2025" }
];

const drafts = [
  { id: 1, title: "Summer Vibes", date: "2 days ago" },
  { id: 2, title: "Geometric Pattern", date: "1 week ago" },
  { id: 3, title: "Typography Experiment", date: "2 weeks ago" }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Profile Header */}
        <div className="card-glass rounded-xl p-6 soft-shadow mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
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
            <div className="text-sm text-muted mb-1">Posts</div>
            <div className="text-3xl font-bold">{posts.length}</div>
          </div>
          <div className="card-glass rounded-xl p-5 soft-shadow">
            <div className="text-sm text-muted mb-1">Followers</div>
            <div className="text-3xl font-bold">{user.followers}</div>
          </div>
          <div className="card-glass rounded-xl p-5 soft-shadow">
            <div className="text-sm text-muted mb-1">Following</div>
            <div className="text-3xl font-bold">{user.following}</div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-3 px-5 text-sm font-medium transition-colors ${
              activeTab === "posts" 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted hover:text-foreground"
            }`}
          >
            Posts
          </button>
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
        {activeTab === "posts" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
            {posts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {posts.map((post) => (
                  <div key={post.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <div className="w-full h-full bg-linear-to-br from-primary/30 to-accent/30" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 4 13.5 4 8.5C4 6.5 5.5 5 7.5 5C9 5 10 6 12 8C14 6 15 5 16.5 5C18.5 5 20 6.5 20 8.5C20 13.5 12 21 12 21Z"/></svg>
                        <span className="text-sm">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span className="text-sm">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted mb-3">No posts yet</div>
                <Link href="/dzyn">
                  <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                    Create a Design
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
        
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