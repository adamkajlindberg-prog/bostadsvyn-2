-- Function to check if all group members have voted and update property status
CREATE OR REPLACE FUNCTION check_and_update_property_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_members INTEGER;
  total_votes INTEGER;
  yes_votes INTEGER;
  maybe_votes INTEGER;
  no_votes INTEGER;
  new_status TEXT;
BEGIN
  -- Count total group members
  SELECT COUNT(*) INTO total_members
  FROM group_members
  WHERE group_id = NEW.group_id;

  -- Count total votes for this property
  SELECT COUNT(*) INTO total_votes
  FROM group_property_votes
  WHERE group_id = NEW.group_id 
    AND property_id = NEW.property_id;

  -- If everyone has voted, calculate majority
  IF total_votes >= total_members THEN
    -- Count each vote type
    SELECT 
      COUNT(*) FILTER (WHERE vote = 'yes'),
      COUNT(*) FILTER (WHERE vote = 'maybe'),
      COUNT(*) FILTER (WHERE vote = 'no')
    INTO yes_votes, maybe_votes, no_votes
    FROM group_property_votes
    WHERE group_id = NEW.group_id 
      AND property_id = NEW.property_id;

    -- Determine new status based on majority
    -- If majority voted No, reject it
    IF no_votes > (yes_votes + maybe_votes) THEN
      new_status := 'rejected';
    -- If majority voted Yes or Maybe, approve it
    ELSE
      new_status := 'approved';
    END IF;

    -- Update the property status
    UPDATE group_properties
    SET status = new_status
    WHERE group_id = NEW.group_id 
      AND property_id = NEW.property_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_vote_cast_check_status ON group_property_votes;

-- Create trigger to run after every vote insert or update
CREATE TRIGGER on_vote_cast_check_status
  AFTER INSERT OR UPDATE ON group_property_votes
  FOR EACH ROW
  EXECUTE FUNCTION check_and_update_property_status();