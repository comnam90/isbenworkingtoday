import { useState, useEffect } from 'react';
import { 
  Database, 
  Terminal, 
  Cpu, 
  Video, 
  Wifi, 
  FileText, 
  Cloud, 
  Beer, 
  Home, 
  AlertTriangle, 
  Coffee, 
  BatteryCharging, 
  ShoppingBag, 
  Clock,
  RefreshCw,
  Activity,
  LucideIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const iconMap: Record<string, LucideIcon> = {
  Database,
  Terminal,
  Cpu,
  Video,
  Wifi,
  FileText,
  Cloud,
  Beer,
  Home,
  AlertTriangle,
  Coffee,
  BatteryCharging,
  ShoppingBag,
  Clock,
};

const statuses = [
  { working: true, answer: "YES", message: "Restoring immutable backups... please wait.", icon: "Database" },
  { working: true, answer: "YES", message: "Fighting with the Veeam API.", icon: "Terminal" },
  { working: true, answer: "YES", message: "Compiling VBRCommander. Do not disturb.", icon: "Cpu" },
  { working: true, answer: "YES", message: "On a Zoom call that could have been an email.", icon: "Video" },
  { working: true, answer: "YES", message: "Troubleshooting a Zigbee network failure.", icon: "Wifi" },
  { working: true, answer: "YES", message: "Writing documentation (just kidding, he's debugging).", icon: "FileText" },
  { working: true, answer: "YES", message: "Deploying to the Cloud... slowly.", icon: "Cloud" },
  { working: false, answer: "NO", message: "Gone to Two Thumbs for a 'meeting'.", icon: "Beer" },
  { working: false, answer: "NO", message: "Tinkering with Home Assistant (again).", icon: "Home" },
  { working: false, answer: "NO", message: "Packet loss detected. Brain buffering.", icon: "AlertTriangle" },
  { working: false, answer: "NO", message: "Error 418: I'm a teapot.", icon: "Coffee" },
  { working: false, answer: "NO", message: "Charging the EV. Taking a nap.", icon: "BatteryCharging" },
  { working: false, answer: "NO", message: "Scouring the Op Shops for vintage tech.", icon: "ShoppingBag" },
  { working: false, answer: "NO", message: "Latency too high. Try again tomorrow.", icon: "Clock" },
];

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}>
    {children}
  </div>
);

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
    {children}
  </div>
);

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight", className)}>
    {children}
  </h3>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("p-6 pt-0", className)}>
    {children}
  </div>
);

const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("flex items-center p-6 pt-0", className)}>
    {children}
  </div>
);

const Button = ({ className, onClick, children }: { className?: string, onClick?: () => void, children: React.ReactNode }) => (
  <button 
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "bg-primary text-primary-foreground hover:bg-primary/90",
      "h-10 px-4 py-2",
      className
    )}
  >
    {children}
  </button>
);

const getRandomStatus = () => {
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
};

const getRandomConfidence = () => {
  return Math.floor(Math.random() * (99 - 15 + 1)) + 15;
};

export default function App() {
  const [status, setStatus] = useState(statuses[0]);
  const [confidence, setConfidence] = useState(99);
  const [loading, setLoading] = useState(false);

  const refreshStatus = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus(getRandomStatus());
      setConfidence(getRandomConfidence());
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    setStatus(getRandomStatus());
    setConfidence(getRandomConfidence());
  }, []);

  const StatusIcon = iconMap[status.icon] || Activity;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center border-b border-border/40 pb-4">
          <CardTitle className="text-lg text-muted-foreground uppercase tracking-widest text-xs font-mono">
            Current Status Query: Is Ben Working?
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-8">
          <div className={cn(
            "text-9xl font-black tracking-tighter drop-shadow-2xl animate-in zoom-in duration-300",
            status.working ? "text-green-500" : "text-red-500"
          )}>
            {status.answer}
          </div>

          <div className="relative group">
            <div className={cn(
              "absolute -inset-4 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-500",
              status.working ? "bg-green-500" : "bg-red-500"
            )}></div>
            <StatusIcon className="w-24 h-24 relative z-10 text-foreground" strokeWidth={1.5} />
          </div>

          <div className="text-center space-y-2">
            <p className="text-xl font-medium leading-relaxed max-w-[80%] mx-auto">
              {status.message}
            </p>
          </div>

          <div className="w-full bg-secondary/50 rounded-lg p-3 flex items-center justify-between text-xs font-mono text-muted-foreground border border-border/50">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 animate-pulse text-blue-500" />
              <span>LIVE TELEMETRY</span>
            </div>
            <div className="flex items-center gap-2">
              <span>CONFIDENCE:</span>
              <span className={cn(
                "font-bold",
                confidence > 80 ? "text-green-500" : confidence > 50 ? "text-yellow-500" : "text-red-500"
              )}>
                {confidence}%
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center pt-2 pb-8">
          <Button 
            onClick={refreshStatus} 
            className="w-full gap-2 text-base h-12"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            {loading ? "Querying Satellite..." : "Check Again"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
