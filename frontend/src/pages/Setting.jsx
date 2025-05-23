import React from 'react';
import { Send, Check } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from '../../constants';

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false, time: "12:00 PM" },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true, time: "12:01 PM" },
  { id: 3, content: "That sounds exciting! Can't wait to see them.", isSent: false, time: "12:02 PM" },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen w-full bg-base-100 text-base-content">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        <header className="mb-8 text-center mt-12">
         
          <p className="text-base-content/70 mt-2 text-lg">
            Choose your perfect theme from our curated collection
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Theme Selection Panel */}
          <div className="order-2 lg:order-1">
            <div className="bg-base-200 rounded-2xl p-6 shadow-lg border border-base-300">
              <h2 className="text-xl font-semibold mb-4">Available Themes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    className="group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                    onClick={() => setTheme(t)}
                  >
                    <div
                      className={`
                        absolute inset-0 rounded-xl transition-all duration-300
                        ${theme === t ? 'bg-base-300/50 shadow-md' : 'hover:bg-base-300/30'}
                      `}
                    />
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-sm" data-theme={t}>
                      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
                        <div className="rounded bg-primary"></div>
                        <div className="rounded bg-secondary"></div>
                        <div className="rounded bg-accent"></div>
                        <div className="rounded bg-neutral"></div>
                      </div>
                    </div>
                    <span className="relative text-xs font-medium">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                      {theme === t && (
                        <span className="absolute -right-1 -top-1 text-primary">
                          <Check size={14} />
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="order-1 lg:order-2">
            <div className="bg-base-200 rounded-2xl p-4 sm:p-6 shadow-lg border border-base-300">
              <div className="bg-base-100 rounded-xl overflow-hidden shadow-sm">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 backdrop-blur-lg bg-base-100/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold">JD</span>
                    </div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                        <p className="text-xs text-base-content/70">Online</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 min-h-[300px] max-h-[300px] overflow-y-auto">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          group relative max-w-[80%] rounded-2xl p-3 transition-all duration-300
                          ${message.isSent 
                            ? "bg-primary text-primary-content hover:shadow-lg hover:shadow-primary/20" 
                            : "bg-base-200 hover:bg-base-300"}
                        `}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5 opacity-70 transition-opacity group-hover:opacity-100
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-base-300">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-11 min-h-0 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      placeholder="Type a message..."
                      value="Preview mode"
                      readOnly
                    />
                    <button className="btn btn-primary h-11 min-h-0 px-4 transition-all duration-300 hover:scale-105">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;