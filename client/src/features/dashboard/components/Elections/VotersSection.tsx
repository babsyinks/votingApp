import { useState } from "react";
import { Mail, Plus, Upload, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/dashboard/components/ui/Card";
import { Button } from "@/features/dashboard/components/ui/Button";
import { Input } from "@/features/dashboard/components/ui/Input";
import { Label } from "@/features/dashboard/components/ui/Label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/dashboard/components/ui/Tabs";
import { toast } from "sonner";

interface VotersSectionProps {
  electionId: string;
}

export const VotersSection = ({ electionId }: VotersSectionProps) => {
  const [voters, setVoters] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEmail = () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (voters.includes(email)) {
      toast.error("This email has already been added");
      return;
    }

    setVoters([...voters, email]);
    setEmail("");
    toast.success("Email added to list");
  };

  const handlePermitVoters = async () => {
    if (voters.length === 0) {
      toast.error("Please add at least one voter email");
      return;
    }

    setIsSubmitting(true);

    // TODO: Send to backend
    setTimeout(() => {
      toast.success(
        `${voters.length} voter${voters.length > 1 ? "s" : ""} permitted successfully!`,
      );
      setVoters([]);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);

    // TODO: Send to backend for processing
    setTimeout(() => {
      toast.success("File uploaded and voters processed successfully!");
      setFile(null);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Add Permitted Voters
        </CardTitle>
        <CardDescription>Specify who can vote in this election</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="import">Import File</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="email">Voter Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter voter email"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddEmail())
                  }
                />
              </div>
              <Button
                onClick={handleAddEmail}
                className="self-end"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {voters.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Added Voters ({voters.length})
                  </h3>
                  <Button
                    onClick={handlePermitVoters}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Permitting..." : "Permit These Voters"}
                  </Button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 p-4 rounded-lg border border-border bg-muted/30">
                  {voters.map((voterEmail, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded bg-card"
                    >
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{voterEmail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Import from Excel or Google Form</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: Excel (.xlsx, .xls) or CSV files
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !file}
                className="w-full bg-gradient-to-r from-primary to-primary/80"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isSubmitting ? "Uploading..." : "Upload and Process"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
