import { z } from "zod";

export const rentalFormSchema = z.object({
  title: z.string().min(1, "Titel krävs"),
  description: z.string().min(20, "Beskrivning måste vara minst 20 tecken"),
  contract_type: z.enum(["first_hand", "second_hand"], {
    message: "Kontraktstyp krävs",
  }),
  rooms: z.number().min(1, "Antal rum krävs"),
  is_shared: z.boolean(),
  rent: z.number().min(1, "Hyra krävs"),
  utilities_included: z.boolean(),
  furnished: z.boolean(),
  pets_allowed: z.boolean(),
  smoking_allowed: z.boolean(),
  address_street: z.string().min(1, "Gatuadress krävs"),
  address_postal_code: z.string().min(5, "Postnummer krävs"),
  address_city: z.string().min(1, "Stad krävs"),
  available_from: z.string().min(1, "Tillgänglig från datum krävs"),
  lease_duration: z.string().min(1, "Uthyrningsperiod krävs"),
  area: z.number().min(1, "Yta krävs"),
  // Property details
  floor_level: z.string().optional(),
  has_elevator: z.boolean(),
  has_balcony: z.boolean(),
  has_garden: z.boolean(),
  has_garage: z.boolean(),
  parking_available: z.boolean(),
  parking_type: z.string().optional(),
  internet_included: z.boolean(),
  building_year: z.number().optional(),
  energy_rating: z.string().optional(),
  // Tenant requirements
  min_income: z.number().optional(),
  min_age: z.number().optional(),
  max_occupants: z.number().optional(),
  references_required: z.boolean(),
  // Neighborhood and transport
  neighborhood_description: z.string().optional(),
  nearest_metro: z.string().optional(),
  transport_description: z.string().optional(),
  // Contact preferences
  contact_phone: z.string().optional(),
  viewing_instructions: z.string().optional(),
  preferred_contact_method: z.enum(["phone", "email", "message"]).optional(),
  // Amenities - Kitchen
  has_dishwasher: z.boolean(),
  has_washing_machine: z.boolean(),
  has_dryer: z.boolean(),
  has_microwave: z.boolean(),
  has_oven: z.boolean(),
  has_freezer: z.boolean(),
  // Amenities - Bathroom
  has_bathtub: z.boolean(),
  has_shower: z.boolean(),
  has_bidet: z.boolean(),
  has_floor_heating: z.boolean(),
  // Amenities - Tech
  has_tv: z.boolean(),
  has_wifi: z.boolean(),
  has_cable_tv: z.boolean(),
  has_air_conditioning: z.boolean(),
  has_heating: z.boolean(),
  has_alarm_system: z.boolean(),
  has_ev_charger: z.boolean(),
  // Amenities - Other
  has_fireplace: z.boolean(),
  has_sauna: z.boolean(),
  has_storage: z.boolean(),
  has_bike_room: z.boolean(),
  has_stroller_room: z.boolean(),
  has_gym: z.boolean(),
  has_common_room: z.boolean(),
  has_pool: z.boolean(),
  has_jacuzzi: z.boolean(),
  has_security_door: z.boolean(),
  has_garage_in_amenities: z.boolean(),
  has_parking_in_amenities: z.boolean(),
});

export type RentalFormData = z.infer<typeof rentalFormSchema>;

export const contractTypes = [
  { value: "first_hand", label: "Förstahandskontrakt" },
  { value: "second_hand", label: "Andrahandskontrakt" },
] as const;

export const leaseDurations = [
  "1 månad",
  "3 månader",
  "6 månader",
  "12 månader",
  "18 månader",
  "24 månader",
  "Tillsvidare",
] as const;

export const parkingTypes = [
  "Parkering i garage",
  "Parkering på gård",
  "Gatuparking",
  "Hyrd parkeringsplats",
] as const;

export const energyRatings = ["A", "B", "C", "D", "E", "F", "G"] as const;

export const contactMethods = [
  { value: "email", label: "E-post" },
  { value: "phone", label: "Telefon" },
  { value: "message", label: "Meddelanden på plattformen" },
] as const;

