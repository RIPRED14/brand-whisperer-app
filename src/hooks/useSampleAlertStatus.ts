import { differenceInHours, differenceInDays, parseISO, isPast } from 'date-fns';

export const useSampleAlertStatus = (
  sample: { 
    createdAt?: string, 
    enterobacteria?: string, 
    yeastMold?: string,
    enteroReadingDue?: string,
    yeastReadingDue?: string,
    status?: string
  }
) => {
  if (!sample || !sample.createdAt) return null;
  
  try {
    const currentDate = new Date();
    
    // Si on a des dates d'échéance spécifiques, on les utilise
    if (sample.enteroReadingDue && !sample.enterobacteria) {
      const enteroReadingDate = parseISO(sample.enteroReadingDue);
      if (isPast(enteroReadingDate)) {
        return 'warning'; // alerte jaune pour entérobactéries en retard
      }
    }
    
    if (sample.yeastReadingDue && !sample.yeastMold) {
      const yeastReadingDate = parseISO(sample.yeastReadingDue);
      if (isPast(yeastReadingDate)) {
        return 'urgent'; // alerte rouge pour levures/moisissures en retard
      }
    }
    
    // Fallback sur la logique basée sur la date de création
    const sampleDate = parseISO(sample.createdAt);
    const hoursSince = differenceInHours(currentDate, sampleDate);
    const daysSince = differenceInDays(currentDate, sampleDate);
    
    // Si le statut indique qu'on attend une lecture d'entérobactéries
    if (sample.status === 'waitingEntero' || (hoursSince >= 24 && !sample.enterobacteria)) {
      return 'warning'; // alerte jaune
    }
    
    // Si le statut indique qu'on attend une lecture de levures/moisissures
    if (sample.status === 'waitingYeast' || (daysSince >= 5 && !sample.yeastMold)) {
      return 'urgent'; // alerte rouge
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating alert status:', error);
    return null;
  }
};
