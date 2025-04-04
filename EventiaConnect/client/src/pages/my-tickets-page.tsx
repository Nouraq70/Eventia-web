import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Ticket, Event } from "@/lib/types";
import TicketCard from "@/components/tickets/TicketCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox } from "lucide-react";

export default function MyTicketsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Mock user ID - in a real implementation this would come from auth context
  const userId = 1;
  
  // Fetch user tickets
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = useQuery<Ticket[]>({
    queryKey: [`/api/users/${userId}/tickets`],
  });
  
  // Fetch all events (to match with tickets)
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  const isLoading = ticketsLoading || eventsLoading;
  
  // Group tickets by status
  const getTicketsByStatus = (status: string) => {
    if (!tickets || !events) return [];
    
    // Filter tickets by status and get corresponding event details
    return tickets
      .filter(ticket => ticket.status === status)
      .map(ticket => {
        const event = events.find(e => e.id === ticket.eventId);
        return { ticket, event };
      });
  };
  
  const upcomingTickets = getTicketsByStatus("confirmed");
  const pastTickets = getTicketsByStatus("completed");
  const cancelledTickets = getTicketsByStatus("cancelled");
  
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-6 min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'ar' ? "تذاكري" : "My Tickets"}
        </h1>
        
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6 grid grid-cols-3">
            <TabsTrigger value="upcoming">
              {language === 'ar' ? "القادمة" : "Upcoming"}
            </TabsTrigger>
            <TabsTrigger value="past">
              {language === 'ar' ? "السابقة" : "Past"}
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              {language === 'ar' ? "الملغية" : "Cancelled"}
            </TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="space-y-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between flex-col md:flex-row gap-4">
                    <div className="flex gap-4">
                      <Skeleton className="h-24 w-24 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : ticketsError ? (
            <div className="text-center p-8 text-red-500">
              {language === 'ar' ? "حدث خطأ أثناء تحميل التذاكر" : "Error loading tickets"}
            </div>
          ) : (
            <>
              <TabsContent value="upcoming">
                {upcomingTickets.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingTickets.map(({ ticket, event }) => (
                      event && <TicketCard key={ticket.id} ticket={ticket} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Inbox className="mx-auto h-16 w-16 text-neutral-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      {language === 'ar' ? "لا توجد تذاكر قادمة" : "No Upcoming Tickets"}
                    </h3>
                    <p className="text-neutral-500">
                      {language === 'ar' 
                        ? "استكشف الفعاليات المتاحة واحجز تذاكرك الآن" 
                        : "Explore available events and book your tickets now"}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastTickets.length > 0 ? (
                  <div className="space-y-4">
                    {pastTickets.map(({ ticket, event }) => (
                      event && <TicketCard key={ticket.id} ticket={ticket} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Inbox className="mx-auto h-16 w-16 text-neutral-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      {language === 'ar' ? "لا توجد تذاكر سابقة" : "No Past Tickets"}
                    </h3>
                    <p className="text-neutral-500">
                      {language === 'ar' 
                        ? "تذاكر الفعاليات التي حضرتها ستظهر هنا" 
                        : "Tickets for events you've attended will appear here"}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cancelled">
                {cancelledTickets.length > 0 ? (
                  <div className="space-y-4">
                    {cancelledTickets.map(({ ticket, event }) => (
                      event && <TicketCard key={ticket.id} ticket={ticket} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Inbox className="mx-auto h-16 w-16 text-neutral-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      {language === 'ar' ? "لا توجد تذاكر ملغية" : "No Cancelled Tickets"}
                    </h3>
                    <p className="text-neutral-500">
                      {language === 'ar' 
                        ? "التذاكر الملغية ستظهر هنا" 
                        : "Cancelled tickets will appear here"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
      
      <Footer />
      <MobileNavigation />
    </>
  );
}
