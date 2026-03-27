import Dashboard from "@/components/Dashboard";
import { LeadProvider } from "@/context/LeadContext";

const Index = () => (
  <LeadProvider>
    <Dashboard />
  </LeadProvider>
);

export default Index;
