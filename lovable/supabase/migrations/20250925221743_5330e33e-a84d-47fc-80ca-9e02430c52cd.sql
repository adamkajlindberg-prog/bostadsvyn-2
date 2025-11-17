-- Create a function to delete user account and all related data
CREATE OR REPLACE FUNCTION public.delete_user_account(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete user roles
  DELETE FROM public.user_roles WHERE user_roles.user_id = delete_user_account.user_id;
  
  -- Delete user preferences  
  DELETE FROM public.user_preferences WHERE user_preferences.user_id = delete_user_account.user_id;
  
  -- Delete user profile
  DELETE FROM public.profiles WHERE profiles.user_id = delete_user_account.user_id;
  
  -- Delete user properties and related data (will cascade)
  DELETE FROM public.properties WHERE properties.user_id = delete_user_account.user_id;
  
  -- Delete user conversations and messages (will cascade)
  DELETE FROM public.conversations WHERE conversations.buyer_id = delete_user_account.user_id OR conversations.seller_id = delete_user_account.user_id;
  
  -- Delete user favorites
  DELETE FROM public.property_favorites WHERE property_favorites.user_id = delete_user_account.user_id;
  
  -- Delete user alerts
  DELETE FROM public.property_alerts WHERE property_alerts.user_id = delete_user_account.user_id;
  
  -- Delete user saved searches
  DELETE FROM public.saved_searches WHERE saved_searches.user_id = delete_user_account.user_id;
  
  -- Delete user chat sessions
  DELETE FROM public.chat_sessions WHERE chat_sessions.user_id = delete_user_account.user_id;
  
  -- Delete user from groups
  DELETE FROM public.group_members WHERE group_members.user_id = delete_user_account.user_id;
  
  -- Delete AI generated images
  DELETE FROM public.ai_generated_images WHERE ai_generated_images.user_id = delete_user_account.user_id;
  
  -- Delete analytics data
  DELETE FROM public.ai_editor_analytics WHERE ai_editor_analytics.user_id = delete_user_account.user_id;
  DELETE FROM public.performance_metrics WHERE performance_metrics.user_id = delete_user_account.user_id;
  
  -- Finally delete the auth user
  DELETE FROM auth.users WHERE id = delete_user_account.user_id;
END;
$$;