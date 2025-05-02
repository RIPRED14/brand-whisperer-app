import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const sites = [
  { id: 'R1', name: 'Laiterie Collet (R1)' },
  { id: 'R2', name: 'Végétal Santé (R2)' },
  { id: 'BAIKO', name: 'Laiterie Baiko' },
];

interface SampleFormInputsProps {
  site: string;
  setSite: (site: string) => void;
  sampleDate: string;
  setSampleDate: (date: string) => void;
  reference: string;
  setReference: (ref: string) => void;
}

const SampleFormInputs = ({
  site,
  setSite,
  sampleDate,
  setSampleDate,
  reference,
  setReference
}: SampleFormInputsProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    sampleDate ? new Date(sampleDate) : undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setSampleDate(format(date, 'yyyy-MM-dd'));
    } else {
      setSampleDate('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="site">Site*</Label>
        <RadioGroup
          id="site"
          value={site}
          onValueChange={setSite}
          className="flex flex-col space-y-1 mt-2"
        >
          {sites.map((siteOption) => (
            <div key={siteOption.id} className="flex items-center space-x-2">
              <RadioGroupItem value={siteOption.id} id={`site-${siteOption.id}`} />
              <Label htmlFor={`site-${siteOption.id}`} className="cursor-pointer">
                {siteOption.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date de prélèvement*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, 'd MMMM yyyy', { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference">Référence</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Référence du prélèvement"
          />
        </div>
      </div>
    </div>
  );
};

export default SampleFormInputs;
