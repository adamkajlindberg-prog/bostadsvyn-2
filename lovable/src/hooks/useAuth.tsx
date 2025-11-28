import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, extraData?: Record<string, any>) => Promise<{ error: any }>;
  signUpBroker: (email: string, password: string, fullName: string, phone?: string, company?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: any }>;
  profile: any | null;
  userRoles: string[];
  subscriptionTier: 'basic' | 'pro' | 'pro_plus' | null;
  isPro: boolean;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<'basic' | 'pro' | 'pro_plus' | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      // Get current auth user for metadata
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData?.user;

      // Get profile (tolerate missing row)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      let currentProfile = profileData as any | null;

      // Create profile if missing
      if (!currentProfile && authUser) {
        const insertPayload: any = {
          user_id: userId,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || null,
          company_name: authUser.user_metadata?.company_name || null,
          org_number: authUser.user_metadata?.org_number || null,
        };
        const { data: inserted } = await supabase
          .from('profiles')
          .insert(insertPayload)
          .select('*')
          .maybeSingle();
        if (inserted) currentProfile = inserted as any;
      }

      // Fetch roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      let rolesList = (rolesData || []).map((r: any) => r.role);

      // Check Stripe subscription status
      try {
        const { data: stripeSubData, error: stripeError } = await supabase.functions.invoke('check-subscription');
        
        if (!stripeError && stripeSubData) {
          // Map Stripe product IDs to subscription tiers
          const productTierMap: Record<string, 'pro' | 'pro_plus'> = {
            'prod_TOs2jnacEEHmfU': 'pro',       // Pro Subscription (Personal)
            'prod_TOs2Kad3mW3IRa': 'pro_plus', // Pro+ Subscription (Personal)
            'prod_TOs7r52GhNYjBj': 'pro',       // Pro Subscription (Company)
            'prod_TOs7LSUYPyMBob': 'pro_plus', // Pro+ Subscription (Company)
          };
          
          if (stripeSubData.subscribed && stripeSubData.product_id) {
            const tier = productTierMap[stripeSubData.product_id] || 'basic';
            setSubscriptionTier(tier);
          } else {
            setSubscriptionTier('basic');
          }
        } else {
          setSubscriptionTier('basic');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionTier('basic');
      }

      // Ensure company role & profile from metadata on first login
      if (authUser) {
        const metaType = authUser.user_metadata?.account_type;
        const metaCompany = authUser.user_metadata?.company_name;
        const metaOrg = authUser.user_metadata?.org_number;
        
        // Ensure company users get the 'company' role
        if (metaType === 'company' && !rolesList.includes('company')) {
          const { error: roleErr } = await supabase.from('user_roles').insert({ user_id: userId, role: 'company' });
          if (!roleErr) rolesList = [...rolesList, 'company'];
        }
        
        if (metaType === 'company' && (metaCompany || metaOrg)) {
          if (!currentProfile || !currentProfile.company_name || !currentProfile.org_number) {
            const { data: updated } = await supabase
              .from('profiles')
              .update({
                company_name: currentProfile?.company_name || metaCompany || null,
                org_number: currentProfile?.org_number || metaOrg || null,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', userId)
              .select('*')
              .maybeSingle();
            if (updated) currentProfile = updated as any;
          }
        }
      }

      if (currentProfile) setProfile(currentProfile);
      setUserRoles(rolesList);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refetchProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer profile fetching to avoid recursion
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
          setSubscriptionTier(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, extraData?: Record<string, any>) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          ...(extraData || {}),
        },
      },
    });

    if (error) {
      toast({
        title: "Registreringsfel",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registrering lyckad",
        description: "Kontrollera din e-post för att bekräfta ditt konto.",
      });
    }

    return { error };
  };

  const signUpBroker = async (email: string, password: string, fullName: string, phone?: string, company?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone: phone,
          company: company,
          broker_signup: true, // This marker will trigger the broker role assignment
        },
      },
    });

    if (error) {
      toast({
        title: "Mäklarregistrering misslyckades",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Mäklarkonto skapat!",
        description: "Kontrollera din e-post för att bekräfta ditt konto. Du får automatiskt mäklarbehörighet.",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Inloggningsfel",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Välkommen tillbaka!",
        description: "Du är nu inloggad.",
      });
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Utloggningsfel",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Utloggad",
        description: "Du har loggats ut framgångsrikt.",
      });
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      throw new Error('Ingen användare är inloggad');
    }

    try {
      // Call our edge function to delete user and all related data
      const { error: deleteError } = await supabase.functions.invoke('delete-user-account', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (deleteError) {
        throw deleteError;
      }

      // Sign out after successful deletion
      await supabase.auth.signOut();

      toast({
        title: "Konto raderat",
        description: "Ditt konto och all associerad data har tagits bort permanent.",
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Kunde inte radera kontot';
      toast({
        title: "Fel vid kontoradering",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signUpBroker,
    signIn,
    signOut,
    deleteAccount,
    profile,
    userRoles,
    subscriptionTier,
    isPro: subscriptionTier === 'pro',
    refetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}