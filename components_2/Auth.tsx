import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export default function Auth() {
  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-8">Welcome to Finance Tracker</h1>
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#4F46E5',
                brandAccent: '#4338CA',
              },
            },
          },
          className: {
            container: 'gap-4',
            button: 'rounded-lg',
            input: 'rounded-lg',
          },
        }}
        providers={[]}
      />
    </div>
  );
}