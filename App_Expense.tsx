import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { LogOut, Wallet } from 'lucide-react';

function App() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Finance Tracker</h1>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[400px,1fr]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ExpenseForm />
          </div>
          <div>
            <ExpenseList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;