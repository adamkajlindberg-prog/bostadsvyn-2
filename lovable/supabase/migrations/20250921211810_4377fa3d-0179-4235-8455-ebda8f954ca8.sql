-- Create conversations table for messaging
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  subject text,
  status text NOT NULL DEFAULT 'active',
  last_message_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'text',
  read_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create viewing requests table
CREATE TABLE public.viewing_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  requester_id uuid NOT NULL,
  requested_date timestamp with time zone NOT NULL,
  alternative_date_1 timestamp with time zone,
  alternative_date_2 timestamp with time zone,
  status text NOT NULL DEFAULT 'pending',
  contact_phone text,
  contact_email text NOT NULL,
  message text,
  response_message text,
  confirmed_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create property inquiries table for general questions
CREATE TABLE public.property_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  inquirer_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  inquiry_type text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'new',
  response text,
  responded_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view conversations they are part of" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Authenticated users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Conversation participants can update" 
ON public.conversations 
FOR UPDATE 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_id 
  AND p.user_id = auth.uid()
));

-- Create policies for messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.conversations c 
  WHERE c.id = conversation_id 
  AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.properties p 
    WHERE p.id = c.property_id 
    AND p.user_id = auth.uid()
  ))
));

CREATE POLICY "Conversation participants can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id AND EXISTS (
  SELECT 1 FROM public.conversations c 
  WHERE c.id = conversation_id 
  AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.properties p 
    WHERE p.id = c.property_id 
    AND p.user_id = auth.uid()
  ))
));

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id OR EXISTS (
  SELECT 1 FROM public.conversations c 
  WHERE c.id = conversation_id 
  AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
));

-- Create policies for viewing requests
CREATE POLICY "Property owners can view requests for their properties" 
ON public.viewing_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_id 
  AND p.user_id = auth.uid()
) OR auth.uid() = requester_id);

CREATE POLICY "Authenticated users can create viewing requests" 
ON public.viewing_requests 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Property owners and requesters can update viewing requests" 
ON public.viewing_requests 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_id 
  AND p.user_id = auth.uid()
) OR auth.uid() = requester_id);

-- Create policies for property inquiries
CREATE POLICY "Property owners can view inquiries for their properties" 
ON public.property_inquiries 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_id 
  AND p.user_id = auth.uid()
) OR (inquirer_id IS NOT NULL AND auth.uid() = inquirer_id));

CREATE POLICY "Anyone can create property inquiries" 
ON public.property_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Property owners can update inquiries" 
ON public.property_inquiries 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_id 
  AND p.user_id = auth.uid()
));

-- Add indexes for better performance
CREATE INDEX idx_conversations_property_id ON public.conversations(property_id);
CREATE INDEX idx_conversations_buyer_id ON public.conversations(buyer_id);
CREATE INDEX idx_conversations_seller_id ON public.conversations(seller_id);
CREATE INDEX idx_conversations_last_message_at ON public.conversations(last_message_at DESC);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX idx_viewing_requests_property_id ON public.viewing_requests(property_id);
CREATE INDEX idx_viewing_requests_requester_id ON public.viewing_requests(requester_id);
CREATE INDEX idx_viewing_requests_status ON public.viewing_requests(status);

CREATE INDEX idx_property_inquiries_property_id ON public.property_inquiries(property_id);
CREATE INDEX idx_property_inquiries_status ON public.property_inquiries(status);

-- Add triggers for updating timestamps
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_viewing_requests_updated_at
BEFORE UPDATE ON public.viewing_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update conversation last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update conversation when message is sent
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();