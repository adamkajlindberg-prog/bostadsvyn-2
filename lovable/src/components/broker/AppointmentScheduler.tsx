import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, addDays, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { sv } from 'date-fns/locale';
import { 
  Calendar,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarIcon
} from 'lucide-react';

interface Appointment {
  id: string;
  type: 'viewing' | 'meeting' | 'consultation' | 'follow_up';
  title: string;
  description?: string;
  property_id?: string;
  property_title?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  location?: string;
  notes?: string;
  created_at: string;
  reminder_sent: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
}

export const AppointmentScheduler: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  // Form state
  const [newAppointment, setNewAppointment] = useState({
    type: 'viewing' as Appointment['type'],
    title: '',
    description: '',
    property_id: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    duration_minutes: 60,
    location: '',
    notes: ''
  });

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      // Mock appointments data for demonstration
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          type: 'viewing',
          title: 'Visning - Rymlig 3:a på Östermalm',
          description: 'Första visning för intresserad köpare',
          property_id: 'prop-1',
          property_title: 'Rymlig 3:a med balkong',
          client_name: 'Anna Svensson',
          client_email: 'anna.svensson@email.com',
          client_phone: '+46 70 123 4567',
          scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 60,
          status: 'confirmed',
          location: 'Östermalm 15, Stockholm',
          notes: 'Klienten är särskilt intresserad av balkongen och ljusinsläppet.',
          created_at: new Date().toISOString(),
          reminder_sent: true
        },
        {
          id: '2',
          type: 'meeting',
          title: 'Värderingsmöte - Villa Danderyd',
          description: 'Värdering av villa för potentiell försäljning',
          client_name: 'Erik Johansson',
          client_email: 'erik.johansson@email.com',
          client_phone: '+46 70 234 5678',
          scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 90,
          status: 'scheduled',
          location: 'Danderyd Centrum 45',
          notes: 'Klienten vill sälja inom 6 månader. Villa från 1985, renoverad 2020.',
          created_at: new Date().toISOString(),
          reminder_sent: false
        },
        {
          id: '3',
          type: 'consultation',
          title: 'Konsultation - Köpprocess',
          description: 'Genomgång av köpprocess för förstagångsköpare',
          client_name: 'Maria Lindberg',
          client_email: 'maria.lindberg@email.com',
          scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 45,
          status: 'scheduled',
          location: 'Kontoret',
          created_at: new Date().toISOString(),
          reminder_sent: false
        }
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda bokningar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async () => {
    try {
      const appointment: Appointment = {
        id: Date.now().toString(),
        ...newAppointment,
        scheduled_at: new Date(`${newAppointment.date}T${newAppointment.time}`).toISOString(),
        status: 'scheduled',
        created_at: new Date().toISOString(),
        reminder_sent: false
      };

      setAppointments(prev => [...prev, appointment]);
      setIsCreatingAppointment(false);
      
      // Reset form
      setNewAppointment({
        type: 'viewing',
        title: '',
        description: '',
        property_id: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '10:00',
        duration_minutes: 60,
        location: '',
        notes: ''
      });

      toast({
        title: "Bokning skapad",
        description: "Ny bokning har skapats framgångsrikt",
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Fel",
        description: "Kunde inte skapa bokning",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status } : apt
      )
    );

    const statusLabels = {
      scheduled: 'schemalagd',
      confirmed: 'bekräftad',
      completed: 'genomförd',
      cancelled: 'avbokad',
      no_show: 'uteblivet'
    };

    toast({
      title: "Status uppdaterad",
      description: `Bokning markerad som ${statusLabels[status]}`,
    });
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.scheduled_at), date)
    ).sort((a, b) => 
      parseISO(a.scheduled_at).getTime() - parseISO(b.scheduled_at).getTime()
    );
  };

  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayAppointments = getAppointmentsForDate(date);
    
    // Generate slots from 9:00 to 18:00
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotDateTime = new Date(date);
        slotDateTime.setHours(hour, minute, 0, 0);
        
        const appointment = dayAppointments.find(apt => {
          const aptTime = parseISO(apt.scheduled_at);
          return aptTime.getHours() === hour && aptTime.getMinutes() === minute;
        });

        slots.push({
          time,
          available: !appointment,
          appointment
        });
      }
    }

    return slots;
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-nordic-ice text-primary';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no_show': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: Appointment['type']) => {
    switch (type) {
      case 'viewing': return <Eye className="h-4 w-4" />;
      case 'meeting': return <User className="h-4 w-4" />;
      case 'consultation': return <Phone className="h-4 w-4" />;
      case 'follow_up': return <Mail className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'HH:mm', { locale: sv });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bokningskalender</h1>
          <p className="text-muted-foreground mt-1">
            Hantera visningar och möten med klienter
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={view} onValueChange={(value) => setView(value as 'calendar' | 'list')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">Kalender</SelectItem>
              <SelectItem value="list">Lista</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreatingAppointment} onOpenChange={setIsCreatingAppointment}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ny bokning
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Skapa ny bokning</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Typ av möte</Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, type: value as Appointment['type'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewing">Visning</SelectItem>
                      <SelectItem value="meeting">Möte</SelectItem>
                      <SelectItem value="consultation">Konsultation</SelectItem>
                      <SelectItem value="follow_up">Uppföljning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Titel</Label>
                  <Input
                    value={newAppointment.title}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Beskriv mötet..."
                  />
                </div>

                <div>
                  <Label>Klientens namn</Label>
                  <Input
                    value={newAppointment.client_name}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="Förnamn Efternamn"
                  />
                </div>

                <div>
                  <Label>E-post</Label>
                  <Input
                    type="email"
                    value={newAppointment.client_email}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, client_email: e.target.value }))}
                    placeholder="namn@email.com"
                  />
                </div>

                <div>
                  <Label>Telefon</Label>
                  <Input
                    value={newAppointment.client_phone}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, client_phone: e.target.value }))}
                    placeholder="+46 70 123 4567"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Datum</Label>
                    <Input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Tid</Label>
                    <Input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Plats</Label>
                  <Input
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Adress eller plats för mötet"
                  />
                </div>

                <div>
                  <Label>Anteckningar</Label>
                  <Textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Ytterligare information..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={createAppointment}
                  className="w-full"
                  disabled={!newAppointment.title || !newAppointment.client_name || !newAppointment.client_email}
                >
                  Skapa bokning
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="shadow-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Välj datum</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={sv}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Day View */}
          <Card className="shadow-card lg:col-span-3">
            <CardHeader>
              <CardTitle>
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: sv })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {generateTimeSlots(selectedDate).map((slot) => (
                  <div
                    key={slot.time}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      slot.appointment ? 'bg-primary/5 border-primary/20' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm w-12">{slot.time}</span>
                      {slot.appointment ? (
                        <div className="flex items-center gap-3">
                          {getTypeIcon(slot.appointment.type)}
                          <div>
                            <p className="font-medium text-sm">{slot.appointment.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {slot.appointment.client_name}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Ledig</span>
                      )}
                    </div>
                    {slot.appointment && (
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(slot.appointment.status)}>
                          {slot.appointment.status === 'scheduled' ? 'Schemalagd' :
                           slot.appointment.status === 'confirmed' ? 'Bekräftad' :
                           slot.appointment.status === 'completed' ? 'Genomförd' :
                           slot.appointment.status === 'cancelled' ? 'Avbokad' : 'Uteblivet'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAppointment(slot.appointment!)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List View */
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Alla bokningar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments
                .sort((a, b) => parseISO(a.scheduled_at).getTime() - parseISO(b.scheduled_at).getTime())
                .map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(appointment.type)}
                        {getStatusIcon(appointment.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{appointment.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{appointment.client_name}</span>
                          <span>{format(parseISO(appointment.scheduled_at), 'dd MMM yyyy HH:mm', { locale: sv })}</span>
                          {appointment.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {appointment.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status === 'scheduled' ? 'Schemalagd' :
                         appointment.status === 'confirmed' ? 'Bekräftad' :
                         appointment.status === 'completed' ? 'Genomförd' :
                         appointment.status === 'cancelled' ? 'Avbokad' : 'Uteblivet'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTypeIcon(selectedAppointment.type)}
                {selectedAppointment.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === 'confirmed' ? 'default' : 'outline'}
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')}
                  >
                    Bekräfta
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')}
                  >
                    Genomförd
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedAppointment.status === 'cancelled' ? 'destructive' : 'outline'}
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                  >
                    Avboka
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedAppointment.client_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedAppointment.client_email}</span>
                </div>
                {selectedAppointment.client_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAppointment.client_phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{format(parseISO(selectedAppointment.scheduled_at), 'dd MMM yyyy HH:mm', { locale: sv })}</span>
                </div>
                {selectedAppointment.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAppointment.location}</span>
                  </div>
                )}
              </div>

              {selectedAppointment.property_title && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fastighet</span>
                  </div>
                  <p className="text-sm">{selectedAppointment.property_title}</p>
                </div>
              )}

              {selectedAppointment.notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Anteckningar:</p>
                  <p className="text-sm">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AppointmentScheduler;