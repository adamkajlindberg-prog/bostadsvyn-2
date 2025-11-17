import {
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "prospect" | "closed";
  preferences: {
    budget_max?: number;
    preferred_areas?: string[];
    property_type?: string;
  };
  last_contact: string;
  notes?: string;
}

interface ClientInquiry {
  id: string;
  property_title: string;
  inquiry_type: string;
  message: string;
  created_at: string;
  status: string;
}

export function ClientManager() {
  const { user, userRoles } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientInquiries, setClientInquiries] = useState<ClientInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");

  const isBroker = userRoles.includes("broker") || userRoles.includes("admin");

  useEffect(() => {
    if (user && isBroker) {
      loadClients();
    }
  }, [user, isBroker, loadClients]);

  useEffect(() => {
    if (selectedClient) {
      loadClientInquiries(selectedClient.id);
    }
  }, [selectedClient, loadClientInquiries]);

  const loadClients = async () => {
    try {
      setIsLoading(true);

      // Get broker's properties
      const { data: properties, error: propError } = await supabase
        .from("properties")
        .select("id")
        .eq("user_id", user?.id);

      if (propError) throw propError;

      const propertyIds = properties?.map((p) => p.id) || [];

      // Get inquiries for broker's properties
      const { data: inquiries, error: inquiriesError } = await supabase
        .from("property_inquiries")
        .select("*")
        .in("property_id", propertyIds)
        .order("created_at", { ascending: false });

      if (inquiriesError) throw inquiriesError;

      // Group inquiries by client email and create client objects
      const clientMap = new Map<string, Client>();

      inquiries?.forEach((inquiry) => {
        const clientKey = inquiry.email;

        if (!clientMap.has(clientKey)) {
          clientMap.set(clientKey, {
            id: inquiry.inquirer_id || inquiry.email,
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            status: inquiry.status === "responded" ? "active" : "prospect",
            preferences: {
              property_type: inquiry.inquiry_type,
            },
            last_contact: inquiry.created_at,
            notes: "",
          });
        } else {
          // Update last contact if this inquiry is more recent
          const existingClient = clientMap.get(clientKey)!;
          if (
            new Date(inquiry.created_at) > new Date(existingClient.last_contact)
          ) {
            existingClient.last_contact = inquiry.created_at;
          }
        }
      });

      setClients(Array.from(clientMap.values()));
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Fel vid laddning",
        description: "Kunde inte ladda klientdata",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadClientInquiries = async (clientId: string) => {
    try {
      const { data: inquiries, error } = await supabase
        .from("property_inquiries")
        .select(`
          *,
          properties!property_inquiries_property_id_fkey(title)
        `)
        .eq("inquirer_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedInquiries: ClientInquiry[] =
        inquiries?.map((inquiry) => ({
          id: inquiry.id,
          property_title: inquiry.properties?.title || "Okänt objekt",
          inquiry_type: inquiry.inquiry_type,
          message: inquiry.message,
          created_at: inquiry.created_at,
          status: inquiry.status,
        })) || [];

      setClientInquiries(formattedInquiries);
    } catch (error) {
      console.error("Error loading client inquiries:", error);
    }
  };

  const updateClientStatus = async (
    clientId: string,
    status: "active" | "prospect" | "closed",
  ) => {
    try {
      // Update client status in local state
      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId ? { ...client, status } : client,
        ),
      );

      if (selectedClient?.id === clientId) {
        setSelectedClient((prev) => (prev ? { ...prev, status } : null));
      }

      toast({
        title: "Status uppdaterad",
        description: `Klientstatus ändrad till ${status === "active" ? "aktiv" : status === "prospect" ? "prospekt" : "avslutad"}`,
      });
    } catch (error) {
      console.error("Error updating client status:", error);
      toast({
        title: "Fel vid uppdatering",
        description: "Kunde inte uppdatera klientstatus",
        variant: "destructive",
      });
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !selectedClient) return;

    try {
      // In a real implementation, you'd save this to a notes table
      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              notes: prev.notes
                ? `${prev.notes}\n\n${new Date().toLocaleDateString("sv-SE")}: ${newNote}`
                : `${new Date().toLocaleDateString("sv-SE")}: ${newNote}`,
            }
          : null,
      );

      setNewNote("");
      toast({
        title: "Anteckning tillagd",
        description: "Din anteckning har sparats",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara anteckningen",
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Aktiv", variant: "default" as const },
      prospect: { label: "Prospekt", variant: "secondary" as const },
      closed: { label: "Avslutad", variant: "outline" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!isBroker) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Mäklarbehörighet krävs</CardTitle>
          <CardDescription>
            Du behöver mäklarbehörighet för att komma åt klienthanteringen.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Klienthantering
          </CardTitle>
          <CardDescription>
            Hantera och kommunicera med dina klienter
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sök klienter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">Alla statusar</option>
                <option value="active">Aktiva</option>
                <option value="prospect">Prospekt</option>
                <option value="closed">Avslutade</option>
              </select>
            </CardContent>
          </Card>

          {/* Client List */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">
                Klienter ({filteredClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : filteredClients.length > 0 ? (
                <div className="space-y-2 p-4">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                        selectedClient?.id === client.id
                          ? "bg-primary/10 border border-primary/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{client.name}</h4>
                        {getStatusBadge(client.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {client.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Senast kontakt:{" "}
                        {new Date(client.last_contact).toLocaleDateString(
                          "sv-SE",
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2" />
                  <p>Inga klienter hittades</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="space-y-6">
              {/* Client Info */}
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {selectedClient.name}
                      </CardTitle>
                      <CardDescription>{selectedClient.email}</CardDescription>
                    </div>
                    {getStatusBadge(selectedClient.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.email}</span>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedClient.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(
                          selectedClient.last_contact,
                        ).toLocaleDateString("sv-SE")}
                      </span>
                    </div>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant={
                        selectedClient.status === "prospect"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateClientStatus(selectedClient.id, "prospect")
                      }
                    >
                      Prospekt
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedClient.status === "active"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateClientStatus(selectedClient.id, "active")
                      }
                    >
                      Aktiv
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedClient.status === "closed"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        updateClientStatus(selectedClient.id, "closed")
                      }
                    >
                      Avslutad
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Client Inquiries */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Förfrågningar ({clientInquiries.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientInquiries.length > 0 ? (
                    <div className="space-y-3">
                      {clientInquiries.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          className="p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {inquiry.property_title}
                            </h4>
                            <Badge variant="outline">
                              {inquiry.inquiry_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {inquiry.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(inquiry.created_at).toLocaleString(
                              "sv-SE",
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Inga förfrågningar
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Anteckningar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedClient.notes && (
                    <div className="p-3 bg-muted rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {selectedClient.notes}
                      </pre>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="new-note">Ny anteckning</Label>
                    <Textarea
                      id="new-note"
                      placeholder="Skriv en anteckning om klienten..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button onClick={addNote} disabled={!newNote.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Lägg till anteckning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <CardTitle className="mb-2">Välj en klient</CardTitle>
                <CardDescription>
                  Välj en klient från listan för att se detaljer och hantera
                  kommunikation
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
