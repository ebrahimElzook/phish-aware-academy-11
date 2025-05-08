
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Eye } from "lucide-react";
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CertificatePreview from './CertificatePreview';

interface CertificateCardProps {
  id: string;
  title: string;
  userName: string;
  completionDate: Date;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  id,
  title,
  userName,
  completionDate
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-500" />
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Issued To:</span>
            <span className="font-medium">{userName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completion Date:</span>
            <span className="font-medium">{format(completionDate, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <CertificatePreview 
              courseName={title}
              userName={userName}
              completionDate={format(completionDate, 'MMMM d, yyyy')}
            />
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;
